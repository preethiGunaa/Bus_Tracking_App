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

    // 🆕 Get user type from navigation state or default to 'user'
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
            // ✅ FIXED: Now sending userType to backend
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    userType: userType  // 🆕 ADD THIS LINE - Send userType to backend
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store token and user data
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data));
                localStorage.setItem('userType', data.data.role); // Store role for future use

                // Enhanced: Check if user is logging into correct dashboard
                if (data.data.role === 'driver' && userType === 'driver') {
                    navigate('/driver-dashboard');
                } else if (data.data.role === 'user' && userType === 'user') {
                    navigate('/user-dashboard');
                } else {
                    // User trying to access wrong dashboard
                    setError(`This account is for ${data.data.role}s. Please use the ${data.data.role} login.`);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('userType');
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

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    {/* User Type Badge */}
                    <div className="user-type-badge">
                        {userType === 'driver' ? '🚗 Driver Login' : '👤 Passenger Login'}
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your {userType} account</p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder={`Enter your ${userType} email`}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`login-btn ${userType === 'driver' ? 'driver-btn' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : `Sign In as ${userType === 'driver' ? 'Driver' : 'Passenger'}`}
                    </button>
                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            state={{ userType: userType }} // 🆕 Pass userType to register
                            className="link"
                        >
                            Sign up here
                        </Link>
                    </p>
                    {/* Switch Login Link */}
                    <p className="switch-login">
                        <span>
                            {userType === 'driver' ? 'Passenger? ' : 'Driver? '}
                            <Link
                                to="/login"
                                className="link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/welcome');
                                }}
                            >
                                Go back to choose
                            </Link>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;