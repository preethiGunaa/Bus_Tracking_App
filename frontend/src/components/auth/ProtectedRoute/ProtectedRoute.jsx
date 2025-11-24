// // src/components/auth/ProtectedRoute/ProtectedRoute.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, requiredRole }) => {
//     const token = localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user') || '{}');

//     if (!token) {
//         return <Navigate to="/login" replace />;
//     }

//     if (requiredRole && user.role !== requiredRole) {
//         return <Navigate to="/" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;
// components/auth/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    console.log('🛡️ Protected Route Check:', {
        hasToken: !!token,
        userRole: user?.role,
        requiredRole,
        userData: user
    });

    // If no token, redirect to login
    if (!token) {
        console.log('❌ No token found, redirecting to welcome');
        return <Navigate to="/welcome" replace />;
    }

    // If user role doesn't match required role, redirect to appropriate dashboard
    if (user?.role !== requiredRole) {
        console.log(`❌ Role mismatch: ${user?.role} !== ${requiredRole}`);

        // Redirect to appropriate dashboard based on actual role
        if (user?.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (user?.role === 'driver') {
            return <Navigate to="/driver-dashboard" replace />;
        } else if (user?.role === 'user') {
            return <Navigate to="/user-dashboard" replace />;
        } else {
            return <Navigate to="/welcome" replace />;
        }
    }

    console.log('✅ Access granted to:', requiredRole);
    return children;
};

export default ProtectedRoute;