import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { submitValue, getMyValues, getMyAlerts } from '../services/api';

const OperatorDashboard = () => {
  const [values, setValues] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Value submission
  const [numericValue, setNumericValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [valuesRes, alertsRes] = await Promise.all([getMyValues(), getMyAlerts()]);
      setValues(valuesRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitValue = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const result = await submitValue({ value: Number(numericValue) });
      setNumericValue('');

      if (result.data.alertsGenerated > 0) {
        setSuccess(`Value submitted! ${result.data.alertsGenerated} alert(s) generated.`);
      } else {
        setSuccess('Value submitted successfully. No threshold breaches detected.');
      }

      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit value');
    } finally {
      setSubmitting(false);
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
        <h3>Operator Dashboard</h3>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <h4>{values.length}</h4>
            <p>Values Submitted</p>
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

        {/* Submit Value */}
        <div className="section-card">
          <div className="card-header">
            <h4>Submit a Numeric Value</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmitValue} className="value-form">
              <div className="form-group">
                <label>Numeric Value</label>
                <input
                  type="number"
                  step="any"
                  value={numericValue}
                  onChange={(e) => setNumericValue(e.target.value)}
                  placeholder="Enter a numeric value"
                  required
                />
              </div>
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Value'}
              </button>
            </form>
          </div>
        </div>

        {/* My Alerts */}
        <div className="section-card">
          <div className="card-header">
            <h4>My Alerts</h4>
          </div>
          <div className="card-body">
            {alerts.length === 0 ? (
              <div className="empty-state"><p>No alerts yet. Submit values to check against thresholds.</p></div>
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

        {/* Submitted Values */}
        <div className="section-card">
          <div className="card-header">
            <h4>My Submitted Values</h4>
          </div>
          <div className="card-body">
            {values.length === 0 ? (
              <div className="empty-state"><p>No values submitted yet.</p></div>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Submitted At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((v) => (
                      <tr key={v._id}>
                        <td><strong>{v.value}</strong></td>
                        <td>{new Date(v.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OperatorDashboard;
