// src/components/layout/Navbar/Navbar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const getCurrentPage = () => {
        if (location.pathname.includes('driver')) return 'Driver Dashboard';
        if (location.pathname.includes('user')) return 'Passenger Dashboard';
        return 'Dashboard';
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Logo/Brand */}
                <div className="navbar-brand">
                    <div className="logo">
                        🚌<span>BusTracker</span>
                    </div>
                    <div className="page-title">{getCurrentPage()}</div>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    <div className="nav-links">
                        {user.role === 'user' && (
                            <>
                                <button
                                    className={`nav-link ${location.pathname === '/user-dashboard' ? 'active' : ''}`}
                                    onClick={() => navigate('/user-dashboard')}
                                >
                                    🗺️ Track Bus
                                </button>

                                <button
                                    className="nav-link"
                                    onClick={() => navigate('/user-dashboard#history')}
                                >
                                    📜 History
                                </button>
                            </>
                        )}

                        {user.role === 'driver' && (
                            <>
                                <button
                                    className={`nav-link ${location.pathname === '/driver-dashboard' ? 'active' : ''}`}
                                    onClick={() => navigate('/driver-dashboard')}
                                >
                                    🚗 My Bus
                                </button>
                                <button
                                    className="nav-link"
                                    onClick={() => navigate('/driver-dashboard#routes')}
                                >
                                    🛣️ Routes
                                </button>
                                <button
                                    className="nav-link"
                                    onClick={() => navigate('/driver-dashboard#schedule')}
                                >
                                    ⏰ Schedule
                                </button>
                            </>
                        )}
                    </div>

                    {/* User Profile & Logout */}
                    <div className="navbar-user">
                        <div className="user-info">
                            <div className="user-avatar">
                                {user.role === 'driver' ? '🚗' : '👤'}
                            </div>
                            <div className="user-details">
                                <span className="user-name">{user.name}</span>
                                <span className="user-role">{user.role}</span>
                            </div>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="mobile-menu">
                    <div className="mobile-nav-links">
                        {user.role === 'user' && (
                            <>
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => {
                                        navigate('/user-dashboard');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    🗺️ Track Bus
                                </button>
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => {
                                        navigate('/user-dashboard#routes');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    📍 Routes
                                </button>
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => {
                                        navigate('/user-dashboard#history');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    📜 History
                                </button>
                            </>
                        )}

                        {user.role === 'driver' && (
                            <>
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => {
                                        navigate('/driver-dashboard');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    🚗 My Bus
                                </button>
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => {
                                        navigate('/driver-dashboard#routes');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    🛣️ Routes
                                </button>
                                <button
                                    className="mobile-nav-link"
                                    onClick={() => {
                                        navigate('/driver-dashboard#schedule');
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    ⏰ Schedule
                                </button>
                            </>
                        )}
                    </div>

                    <div className="mobile-user-info">
                        <div className="user-avatar">
                            {user.role === 'driver' ? '🚗' : '👤'}
                        </div>
                        <div className="user-details">
                            <span className="user-name">{user.name}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <button className="mobile-logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;