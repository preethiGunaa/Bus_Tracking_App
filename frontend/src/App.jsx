import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import global styles
import './styles/variables.css';
import './styles/globals.css';

// Import components
import WelcomePage from './pages/Welcome';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserDashboard from './pages/Dashboard/UserDashboard';
import DriverDashboard from './pages/Driver/DriverDashboard';

// Material-UI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#f59e0b',
    },
  },
});

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<WelcomePage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute requiredRole="user">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver-dashboard"
              element={
                <ProtectedRoute requiredRole="driver">
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<WelcomePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;