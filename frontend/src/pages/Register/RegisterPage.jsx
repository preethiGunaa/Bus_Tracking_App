// src/pages/Register/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        userType: 'user'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const location = useLocation();
    const initialUserType = location.state?.userType || 'user';

    React.useEffect(() => {
        setFormData(prev => ({ ...prev, userType: initialUserType }));
    }, [initialUserType]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            // In your handleSubmit function, replace the fetch call with this:
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    role: formData.userType,     // Send as 'role'
                    userType: formData.userType  // Also send as 'userType' for backup
                }),
            });

            console.log('🟡 FRONTEND: Registration request sent with role:', formData.userType);

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful!', data);

                // Auto-login after successful registration
                const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        userType: formData.userType
                    }),
                });

                const loginData = await loginResponse.json();

                if (loginResponse.ok) {
                    localStorage.setItem('token', loginData.token);
                    localStorage.setItem('userType', formData.userType);
                    localStorage.setItem('user', JSON.stringify(loginData.user));

                    // Redirect based on user type
                    if (formData.userType === 'driver') {
                        navigate('/driver-dashboard');
                    } else {
                        navigate('/user-dashboard');
                    }
                } else {
                    navigate('/login', { state: { userType: formData.userType } });
                }
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    const switchUserType = () => {
        const newUserType = formData.userType === 'user' ? 'driver' : 'user';
        setFormData(prev => ({ ...prev, userType: newUserType }));
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <button className="back-btn" onClick={handleBack}>
                    ← Back to Home
                </button>

                <div className="register-header">
                    <div className="register-icon">
                        {formData.userType === 'driver' ? '🚗' : '👤'}
                    </div>
                    <h1>
                        {formData.userType === 'driver' ? 'Driver Registration' : 'Passenger Registration'}
                    </h1>
                    <p>Create your account to get started</p>
                </div>

                {/* User Type Switch */}
                <div className="user-type-switch">
                    <button
                        type="button"
                        className={`switch-btn ${formData.userType === 'user' ? 'active' : ''}`}
                        onClick={switchUserType}
                    >
                        👤 Passenger
                    </button>
                    <button
                        type="button"
                        className={`switch-btn ${formData.userType === 'driver' ? 'active' : ''}`}
                        onClick={switchUserType}
                    >
                        🚗 Driver
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter your phone number"
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
                            placeholder="Enter your password (min. 6 characters)"
                            minLength="6"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account?{' '}
                    <span
                        onClick={() => navigate('/login', { state: { userType: formData.userType } })}
                    >
                        Sign In
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;