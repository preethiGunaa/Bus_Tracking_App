import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
    const navigate = useNavigate();

    const handleUserLogin = () => {
        navigate('/login', { state: { userType: 'user' } });
    };

    const handleDriverLogin = () => {
        navigate('/login', { state: { userType: 'driver' } });
    };

    return (
        <div className="welcome-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        🚌 Track Every Bus, Anytime, Anywhere
                    </div>

                    <h1 className="hero-title">
                        Smart Bus Tracking
                        <span className="title-accent"> Made Simple</span>
                    </h1>

                    <p className="hero-description">
                        Real-time tracking for both government and private buses.
                        Never miss your bus again with live location updates,
                        accurate arrival times, and smart route planning.
                    </p>

                    {/* 🆕 DUAL LOGIN OPTIONS */}
                    <div className="login-options">
                        <button
                            className="login-option-btn user-login"
                            onClick={handleUserLogin}
                        >
                            <div className="option-icon">👤</div>
                            <div className="option-content">
                                <h3>Passenger Login</h3>
                                <p>Track buses, find routes, plan journeys</p>
                            </div>
                            <div className="option-arrow">→</div>
                        </button>

                        <button
                            className="login-option-btn driver-login"
                            onClick={handleDriverLogin}
                        >
                            <div className="option-icon">🚗</div>
                            <div className="option-content">
                                <h3>Driver Login</h3>
                                <p>Manage your bus, update location, schedules</p>
                            </div>
                            <div className="option-arrow">→</div>
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">📍</div>
                            <h3>Live Tracking</h3>
                            <p>Real-time bus locations on interactive maps</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">⏱️</div>
                            <h3>Accurate ETAs</h3>
                            <p>Precise arrival times and schedule information</p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">🚌</div>
                            <h3>All Bus Types</h3>
                            <p>Track both government and private buses</p>
                        </div>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="hero-visual">
                    <div className="bus-animation">🚌</div>
                    <div className="map-dots">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WelcomePage;