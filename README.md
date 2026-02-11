# Threshold-Based Alert Management System - Frontend

## Overview
React-based frontend application for the Threshold-Based Alert Management System with role-based dashboards.

## Tech Stack
- **React** 18.x
- **React Router** (Navigation)
- **Axios** (API calls)
- **CSS3** (Styling)

## Features
- User authentication (Login/Register)
- Role-based routing and dashboards
- **Admin Dashboard**:
  - Create, edit, delete threshold rules
  - View all system alerts
  - Manage threshold status (active/inactive)
  - System statistics overview
- **Operator Dashboard**:
  - Submit numeric values for monitoring
  - View personal alerts
  - Track submission history

## Project Structure
```
src/
├── components/
│   ├── Navbar.js           # Navigation bar with user info
│   └── ProtectedRoute.js   # Route protection wrapper
├── context/
│   └── AuthContext.js      # Authentication state management
├── pages/
│   ├── Login.js            # Login page
│   ├── Register.js         # Registration page
│   ├── AdminDashboard.js   # Admin interface
│   └── OperatorDashboard.js # Operator interface
├── services/
│   └── api.js              # Axios API configuration
├── App.js                  # Main app component with routing
├── index.js                # App entry point
└── index.css               # Global styles
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Backend API running

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Prassanna-Srinivass/Threshold-Based-Alert-Management-System_Frontend.git
cd Threshold-Based-Alert-Management-System_Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Environment Variables
- `REACT_APP_API_URL` - Backend API base URL

## User Roles

### ADMIN
- Define and manage threshold rules
- View all system alerts
- Monitor all operator activities
- Configure min/max threshold values

### OPERATOR
- Submit numeric values for monitoring
- View alerts related to their submissions
- Track personal value submission history

## Key Features

### Authentication
- JWT token-based authentication
- Auto-redirect based on user role
- Protected routes with role validation

### Admin Features
- Dynamic threshold creation with validation
- Real-time threshold status toggling
- Comprehensive alert viewing with filtering
- Statistics dashboard

### Operator Features
- One-click value submission
- Instant alert feedback
- Personal alert history
- Value tracking table

## Build for Production
```bash
npm run build
```

## Author
Prassanna Srinivasan
