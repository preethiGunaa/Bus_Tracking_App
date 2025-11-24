// // import React, { useState } from 'react';
// // import { Link, useNavigate, useLocation } from 'react-router-dom';
// // import './LoginPage.css';

// // const LoginPage = () => {
// //     const [formData, setFormData] = useState({
// //         email: '',
// //         password: ''
// //     });
// //     const [loading, setLoading] = useState(false);
// //     const [error, setError] = useState('');

// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     // 🆕 Get user type from navigation state or default to 'user'
// //     const userType = location.state?.userType || 'user';

// //     const handleChange = (e) => {
// //         setFormData({
// //             ...formData,
// //             [e.target.name]: e.target.value
// //         });

// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);
// //         setError('');

// //         try {
// //             // ✅ FIXED: Now sending userType to backend
// //             const response = await fetch('http://localhost:5000/api/auth/login', {
// //                 method: 'POST',
// //                 headers: {
// //                     'Content-Type': 'application/json',
// //                 },
// //                 body: JSON.stringify({
// //                     email: formData.email,
// //                     password: formData.password,
// //                     userType: userType  // 🆕 ADD THIS LINE - Send userType to backend
// //                 })
// //             });

// //             const data = await response.json();

// //             if (data.success) {
// //                 // Store token and user data
// //                 localStorage.setItem('token', data.data.token);
// //                 localStorage.setItem('user', JSON.stringify(data.data));
// //                 localStorage.setItem('userType', data.data.role); // Store role for future use

// //                 // Enhanced: Check if user is logging into correct dashboard
// //                 if (data.data.role === 'driver' && userType === 'driver') {
// //                     navigate('/driver-dashboard');
// //                 } else if (data.data.role === 'user' && userType === 'user') {
// //                     navigate('/user-dashboard');
// //                 } else {
// //                     // User trying to access wrong dashboard
// //                     setError(`This account is for ${data.data.role}s. Please use the ${data.data.role} login.`);
// //                     localStorage.removeItem('token');
// //                     localStorage.removeItem('user');
// //                     localStorage.removeItem('userType');
// //                 }
// //             } else {
// //                 setError(data.message || 'Login failed');
// //             }
// //         } catch (error) {
// //             setError('Network error. Please try again.');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <div className="login-container">
// //             <div className="login-card">
// //                 <div className="login-header">
// //                     {/* User Type Badge */}
// //                     <div className="user-type-badge">
// //                         {userType === 'driver' ? '🚗 Driver Login' : '👤 Passenger Login'}
// //                     </div>
// //                     <h1>Welcome Back</h1>
// //                     <p>Sign in to your {userType} account</p>
// //                 </div>

// //                 {error && (
// //                     <div className="error-message">
// //                         {error}
// //                     </div>
// //                 )}

// //                 <form onSubmit={handleSubmit} className="login-form">
// //                     <div className="form-group">
// //                         <label htmlFor="email">Email Address</label>
// //                         <input
// //                             type="email"
// //                             id="email"
// //                             name="email"
// //                             value={formData.email}
// //                             onChange={handleChange}
// //                             required
// //                             placeholder={`Enter your ${userType} email`}
// //                         />
// //                     </div>

// //                     <div className="form-group">
// //                         <label htmlFor="password">Password</label>
// //                         <input
// //                             type="password"
// //                             id="password"
// //                             name="password"
// //                             value={formData.password}
// //                             onChange={handleChange}
// //                             required
// //                             placeholder="Enter your password"
// //                         />
// //                     </div>

// //                     <button
// //                         type="submit"
// //                         className={`login-btn ${userType === 'driver' ? 'driver-btn' : ''}`}
// //                         disabled={loading}
// //                     >
// //                         {loading ? 'Signing In...' : `Sign In as ${userType === 'driver' ? 'Driver' : 'Passenger'}`}
// //                     </button>
// //                 </form>

// //                 <div className="login-footer">
// //                     <p>
// //                         Don't have an account?{' '}
// //                         <Link
// //                             to="/register"
// //                             state={{ userType: userType }} // 🆕 Pass userType to register
// //                             className="link"
// //                         >
// //                             Sign up here
// //                         </Link>
// //                     </p>
// //                     {/* Switch Login Link */}
// //                     <p className="switch-login">
// //                         <span>
// //                             {userType === 'driver' ? 'Passenger? ' : 'Driver? '}
// //                             <Link
// //                                 to="/login"
// //                                 className="link"
// //                                 onClick={(e) => {
// //                                     e.preventDefault();
// //                                     navigate('/welcome');
// //                                 }}
// //                             >
// //                                 Go back to choose
// //                             </Link>
// //                         </span>
// //                     </p>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default LoginPage;

// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import './LoginPage.css';

// const LoginPage = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');

//     const navigate = useNavigate();
//     const location = useLocation();

//     // 🆕 Get user type from navigation state or default to 'user'
//     const userType = location.state?.userType || 'user';

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             // ✅ FIXED: Now sending userType to backend
//             const response = await fetch('http://localhost:5000/api/auth/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     email: formData.email,
//                     password: formData.password,
//                     userType: userType  // 🆕 Send userType to backend
//                 })
//             });

//             const data = await response.json();

//             if (data.success) {
//                 // Store token and user data
//                 localStorage.setItem('token', data.data.token);
//                 localStorage.setItem('user', JSON.stringify(data.data));
//                 localStorage.setItem('userType', data.data.role); // Store role for future use

//                 // 🆕 ENHANCED: Redirect based on user role
//                 if (data.data.role === 'admin') {
//                     navigate('/admin/dashboard');
//                 } else if (data.data.role === 'driver' && userType === 'driver') {
//                     navigate('/driver-dashboard');
//                 } else if (data.data.role === 'user' && userType === 'user') {
//                     navigate('/user-dashboard');
//                 } else {
//                     // User trying to access wrong dashboard
//                     setError(`This account is for ${data.data.role}s. Please use the ${data.data.role} login.`);
//                     localStorage.removeItem('token');
//                     localStorage.removeItem('user');
//                     localStorage.removeItem('userType');
//                 }
//             } else {
//                 setError(data.message || 'Login failed');
//             }
//         } catch (error) {
//             setError('Network error. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 🆕 Get user type display name
//     const getUserTypeDisplay = () => {
//         switch (userType) {
//             case 'admin':
//                 return '👑 Admin';
//             case 'driver':
//                 return '🚗 Driver';
//             default:
//                 return '👤 Passenger';
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-card">
//                 <div className="login-header">
//                     {/* User Type Badge */}
//                     <div className={`user-type-badge ${userType}`}>
//                         {getUserTypeDisplay()} Login
//                     </div>
//                     <h1>Welcome Back</h1>
//                     <p>Sign in to your {userType} account</p>
//                 </div>

//                 {error && (
//                     <div className="error-message">
//                         {error}
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="login-form">
//                     <div className="form-group">
//                         <label htmlFor="email">Email Address</label>
//                         <input
//                             type="email"
//                             id="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             placeholder={`Enter your ${userType} email`}
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="password">Password</label>
//                         <input
//                             type="password"
//                             id="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter your password"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className={`login-btn ${userType}-btn`}
//                         disabled={loading}
//                     >
//                         {loading ? 'Signing In...' : `Sign In as ${getUserTypeDisplay()}`}
//                     </button>
//                 </form>

//                 <div className="login-footer">
//                     <p>
//                         Don't have an account?{' '}
//                         <Link
//                             to="/register"
//                             state={{ userType: userType }}
//                             className="link"
//                         >
//                             Sign up here
//                         </Link>
//                     </p>

//                     {/* 🆕 Switch Login Link */}
//                     <p className="switch-login">
//                         <span>
//                             Not a {userType}?{' '}
//                             <Link
//                                 to="/welcome"
//                                 className="link"
//                             >
//                                 Choose different role
//                             </Link>
//                         </span>
//                     </p>

//                     {/* 🆕 Admin Note */}
//                     {userType === 'admin' && (
//                         <div className="admin-note">
//                             💡 <strong>Admin Access:</strong> System administrators only
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const userType = location.state?.userType || 'user';

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    userType: userType
                })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));

                if (data.data.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (data.data.role === 'driver') {
                    navigate('/driver-dashboard');
                } else if (data.data.role === 'user') {
                    navigate('/user-dashboard');
                } else {
                    setError('Unknown user role. Please contact support.');
                    localStorage.clear();
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getUserTypeDisplay = () => {
        switch (userType) {
            case 'admin': return 'Admin';
            case 'driver': return 'Driver';
            default: return 'Passenger';
        }
    };

    const getRoleDescription = () => {
        switch (userType) {
            case 'admin': return 'System administration and analytics';
            case 'driver': return 'Manage your bus and routes';
            default: return 'Track buses and plan your journey';
        }
    };

    return (
        <div className="login-page">
            {/* Header */}
            <header className="login-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <h1>🚌 Chalo Bus</h1>
                        </div>
                        <Link to="/" className="btn btn-outline">
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="login-section">
                <div className="container">
                    <div className="login-container">
                        <div className="login-card">
                            <div className="login-header-content">
                                <div className={`user-type-badge ${userType}`}>
                                    {getUserTypeDisplay()} Login
                                </div>
                                <h1 className="login-title">Welcome Back</h1>
                                <p className="login-subtitle">
                                    Sign in to your {getUserTypeDisplay().toLowerCase()} account
                                </p>
                                <p className="role-description">
                                    {getRoleDescription()}
                                </p>
                            </div>

                            {error && (
                                <div className="alert alert-error">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="login-form">
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                        placeholder="Enter your password"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`btn w-full ${userType === 'driver' ? 'btn-secondary' : 'btn-primary'} ${loading ? 'loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Signing In...' : `Sign In as ${getUserTypeDisplay()}`}
                                </button>
                            </form>

                            <div className="login-footer">
                                <p className="footer-text">
                                    Don't have an account?{' '}
                                    <Link to="/register" state={{ userType }} className="link">
                                        Create one here
                                    </Link>
                                </p>

                                <div className="switch-role">
                                    <p>
                                        Not a {getUserTypeDisplay().toLowerCase()}?{' '}
                                        <Link to="/" className="link">
                                            Choose different role
                                        </Link>
                                    </p>
                                </div>

                                {userType === 'admin' && (
                                    <div className="admin-note">
                                        <strong>🔒 Admin Access:</strong> System administrators only
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginPage;