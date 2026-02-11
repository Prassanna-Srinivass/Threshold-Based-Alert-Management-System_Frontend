import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  getThresholds,
  createThreshold,
  updateThreshold,
  deleteThreshold,
  getAllAlerts
} from '../services/api';

const AdminDashboard = () => {
  const [thresholds, setThresholds] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New threshold form
  const [newThreshold, setNewThreshold] = useState({ name: '', minValue: '', maxValue: '' });
  const [creating, setCreating] = useState(false);

  // Edit modal
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ id: '', name: '', minValue: '', maxValue: '', isActive: true });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [thresholdRes, alertRes] = await Promise.all([getThresholds(), getAllAlerts()]);
      setThresholds(thresholdRes.data);
      setAlerts(alertRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThreshold = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCreating(true);

    try {
      const payload = {
        name: newThreshold.name,
        minValue: newThreshold.minValue !== '' ? Number(newThreshold.minValue) : null,
        maxValue: newThreshold.maxValue !== '' ? Number(newThreshold.maxValue) : null
      };
      await createThreshold(payload);
      setNewThreshold({ name: '', minValue: '', maxValue: '' });
      setSuccess('Threshold created successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create threshold');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (threshold) => {
    setEditData({
      id: threshold._id,
      name: threshold.name,
      minValue: threshold.minValue != null ? threshold.minValue : '',
      maxValue: threshold.maxValue != null ? threshold.maxValue : '',
      isActive: threshold.isActive
    });
    setEditModal(true);
  };

  const handleUpdateThreshold = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: editData.name,
        minValue: editData.minValue !== '' ? Number(editData.minValue) : null,
        maxValue: editData.maxValue !== '' ? Number(editData.maxValue) : null,
        isActive: editData.isActive
      };
      await updateThreshold(editData.id, payload);
      setEditModal(false);
      setSuccess('Threshold updated successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update threshold');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this threshold?')) return;
    setError('');
    setSuccess('');

    try {
      await deleteThreshold(id);
      setSuccess('Threshold deleted successfully');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete threshold');
    }
  };

  const handleToggleActive = async (threshold) => {
    try {
      await updateThreshold(threshold._id, { isActive: !threshold.isActive });
      fetchData();
    } catch (err) {
      setError('Failed to toggle threshold status');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">Loading dashboard...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <h3>Admin Dashboard</h3>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <h4>{thresholds.length}</h4>
            <p>Total Thresholds</p>
          </div>
          <div className="stat-card">
            <h4>{thresholds.filter(t => t.isActive).length}</h4>
            <p>Active Thresholds</p>
          </div>
          <div className="stat-card">
            <h4>{alerts.length}</h4>
            <p>Total Alerts</p>
          </div>
          <div className="stat-card">
            <h4>{alerts.filter(a => !a.isResolved).length}</h4>
            <p>Unresolved Alerts</p>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* Create Threshold */}
        <div className="section-card">
          <div className="card-header">
            <h4>Create New Threshold Rule</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateThreshold} className="inline-form">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newThreshold.name}
                  onChange={(e) => setNewThreshold({ ...newThreshold, name: e.target.value })}
                  placeholder="e.g., Temperature"
                  required
                />
              </div>
              <div className="form-group">
                <label>Min Value</label>
                <input
                  type="number"
                  step="any"
                  value={newThreshold.minValue}
                  onChange={(e) => setNewThreshold({ ...newThreshold, minValue: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <div className="form-group">
                <label>Max Value</label>
                <input
                  type="number"
                  step="any"
                  value={newThreshold.maxValue}
                  onChange={(e) => setNewThreshold({ ...newThreshold, maxValue: e.target.value })}
                  placeholder="Optional"
                />
              </div>
              <button type="submit" className="btn-submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </div>

        {/* Thresholds Table */}
        <div className="section-card">
          <div className="card-header">
            <h4>Threshold Rules</h4>
          </div>
          <div className="card-body">
            {thresholds.length === 0 ? (
              <div className="empty-state"><p>No threshold rules defined yet.</p></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Min Value</th>
                      <th>Max Value</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {thresholds.map((t) => (
                      <tr key={t._id}>
                        <td><strong>{t.name}</strong></td>
                        <td>{t.minValue != null ? t.minValue : '—'}</td>
                        <td>{t.maxValue != null ? t.maxValue : '—'}</td>
                        <td>
                          <span className={`badge ${t.isActive ? 'badge-active' : 'badge-inactive'}`}>
                            {t.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                        <td>
                          <button className="btn-action btn-edit" onClick={() => handleEdit(t)}>Edit</button>
                          <button className="btn-action btn-toggle" onClick={() => handleToggleActive(t)}>
                            {t.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button className="btn-action btn-delete" onClick={() => handleDelete(t._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Alerts Table */}
        <div className="section-card">
          <div className="card-header">
            <h4>All System Alerts</h4>
          </div>
          <div className="card-body">
            {alerts.length === 0 ? (
              <div className="empty-state"><p>No alerts generated yet.</p></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Alert Type</th>
                      <th>Message</th>
                      <th>Value</th>
                      <th>Threshold</th>
                      <th>Status</th>
                      <th>Generated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alert) => (
                      <tr key={alert._id}>
                        <td>
                          <span className={`badge ${alert.alertType === 'MIN_BREACH' ? 'alert-min' : 'alert-max'}`}>
                            {alert.alertType}
                          </span>
                        </td>
                        <td>{alert.alertMessage}</td>
                        <td>{alert.valueId?.value}</td>
                        <td>{alert.thresholdId?.name}</td>
                        <td>
                          <span className={`badge ${alert.isResolved ? 'badge-success' : 'badge-danger'}`}>
                            {alert.isResolved ? 'Resolved' : 'Unresolved'}
                          </span>
                        </td>
                        <td>{new Date(alert.generatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Threshold</h3>
            <form onSubmit={handleUpdateThreshold}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Min Value</label>
                <input
                  type="number"
                  step="any"
                  value={editData.minValue}
                  onChange={(e) => setEditData({ ...editData, minValue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Max Value</label>
                <input
                  type="number"
                  step="any"
                  value={editData.maxValue}
                  onChange={(e) => setEditData({ ...editData, maxValue: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editData.isActive}
                    onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
