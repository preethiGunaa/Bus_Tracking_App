
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import './WelcomePage.css';

// const WelcomePage = () => {
//     const navigate = useNavigate();

//     const handleUserLogin = () => {
//         navigate('/login', { state: { userType: 'user' } });
//     };

//     const handleDriverLogin = () => {
//         navigate('/login', { state: { userType: 'driver' } });
//     };

//     const handleAdminLogin = () => {
//         navigate('/login', { state: { userType: 'admin' } });
//     };

//     return (
//         <div className="welcome-page">
//             {/* Header - Fixed at top like RedBus */}
//             <header className="welcome-header">
//                 <div className="container">
//                     <div className="header-content">
//                         <div className="logo">
//                             <h1>🚌 Chalo Bus</h1>
//                         </div>
//                         <nav className="nav-links">
//                             <a href="#features">Features</a>
//                             <a href="#about">About</a>
//                             <a href="#contact">Contact</a>
//                             <button className="btn btn-outline" onClick={handleUserLogin}>
//                                 Passenger Login
//                             </button>
//                         </nav>
//                     </div>
//                 </div>
//             </header>

//             {/* Hero Section with Background - Similar to RedBus landing */}
//             <section className="hero-section">
//                 <div className="hero-background">
//                     <div className="container">
//                         <div className="hero-content">
//                             <div className="hero-text">
//                                 <h1 className="hero-title">
//                                     Track Every Bus,
//                                     <span className="text-accent"> Anytime, Anywhere</span>
//                                 </h1>
//                                 <p className="hero-description">
//                                     Real-time tracking for both government and private buses.
//                                     Never miss your bus again with live location updates,
//                                     accurate arrival times, and smart route planning.
//                                 </p>

//                                 {/* Quick Actions similar to RedBus search concept */}
//                                 <div className="quick-actions">
//                                     <button className="btn btn-primary btn-large" onClick={handleUserLogin}>
//                                         🚀 Start Tracking Now
//                                     </button>
//                                     <button className="btn btn-secondary btn-large" onClick={handleDriverLogin}>
//                                         🚗 Driver Portal
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Features Section */}
//             <section className="features-section" id="features">
//                 <div className="container">
//                     <div className="section-header">
//                         <h2 className="section-title">Why Choose Chalo Bus?</h2>
//                         <p className="section-subtitle">
//                             Experience the future of public transportation with our comprehensive tracking solutions
//                         </p>
//                     </div>

//                     <div className="features-grid">
//                         <div className="feature-card">
//                             <div className="feature-icon primary">📍</div>
//                             <h3 className="feature-title">Live Tracking</h3>
//                             <p className="feature-description">
//                                 Real-time bus locations on interactive maps with accurate ETAs and route information.
//                             </p>
//                         </div>

//                         <div className="feature-card">
//                             <div className="feature-icon secondary">⏱️</div>
//                             <h3 className="feature-title">Smart Scheduling</h3>
//                             <p className="feature-description">
//                                 Intelligent arrival predictions and schedule optimization for better planning.
//                             </p>
//                         </div>

//                         <div className="feature-card">
//                             <div className="feature-icon primary">🚌</div>
//                             <h3 className="feature-title">All Bus Types</h3>
//                             <p className="feature-description">
//                                 Track both government and private buses across multiple routes and operators.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Login Options Section */}
//             <section className="login-section">
//                 <div className="container">
//                     <div className="section-header">
//                         <h2 className="section-title">Get Started</h2>
//                         <p className="section-subtitle">
//                             Choose your role to access the platform
//                         </p>
//                     </div>

//                     <div className="login-options-grid">
//                         <div className="login-option-card" onClick={handleUserLogin}>
//                             <div className="option-icon primary">👤</div>
//                             <div className="option-content">
//                                 <h3>Passenger</h3>
//                                 <p>Track buses, find routes, and plan your journey</p>
//                                 <button className="btn btn-primary w-full">
//                                     Passenger Login
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="login-option-card" onClick={handleDriverLogin}>
//                             <div className="option-icon secondary">🚗</div>
//                             <div className="option-content">
//                                 <h3>Driver</h3>
//                                 <p>Manage your bus, update location, and schedules</p>
//                                 <button className="btn btn-secondary w-full">
//                                     Driver Login
//                                 </button>
//                             </div>
//                         </div>

//                         <div className="login-option-card" onClick={handleAdminLogin}>
//                             <div className="option-icon primary">👑</div>
//                             <div className="option-content">
//                                 <h3>Admin</h3>
//                                 <p>System analytics, reports, and management</p>
//                                 <button className="btn btn-outline w-full">
//                                     Admin Login
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Footer */}
//             <footer className="welcome-footer">
//                 <div className="container">
//                     <div className="footer-content">
//                         <div className="footer-links">
//                             <a href="#privacy">Privacy Policy</a>
//                             <a href="#terms">Terms of Service</a>
//                             <a href="#help">Help Center</a>
//                         </div>
//                         <p>&copy; 2024 Chalo Bus Tracking System. All rights reserved.</p>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default WelcomePage;

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

    const handleAdminLogin = () => {
        navigate('/login', { state: { userType: 'admin' } });
    };

    // Smooth scroll function for navigation
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="welcome-page">
            {/* Header - Fixed at top */}
            <header className="welcome-header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <h1>🚌 Chalo Bus</h1>
                        </div>
                        <nav className="nav-links">
                            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
                            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
                            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a>
                            <button className="btn btn-outline" onClick={handleUserLogin}>
                                Passenger Login
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section with Background Image */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-overlay"></div>
                    <div className="container">
                        <div className="hero-content">
                            <div className="hero-text">
                                <div className="hero-badge">
                                    🚌 Real-Time Bus Tracking
                                </div>
                                <h1 className="hero-title">
                                    Never Miss Your
                                    <span className="text-accent"> Bus Again</span>
                                </h1>
                                <p className="hero-description">
                                    Track government and private buses in real-time with live location updates,
                                    accurate arrival predictions, and smart route planning for seamless commuting.
                                </p>

                                {/* Stats Section */}
                                <div className="hero-stats">
                                    <div className="stat-item">
                                        <div className="stat-number">500+</div>
                                        <div className="stat-label">Buses Tracked</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">50+</div>
                                        <div className="stat-label">Routes Covered</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-number">10K+</div>
                                        <div className="stat-label">Happy Users</div>
                                    </div>
                                </div>

                                <div className="hero-actions">
                                    <button className="btn btn-primary btn-large" onClick={handleUserLogin}>
                                        🚀 Start Tracking Now
                                    </button>
                                    <button className="btn btn-secondary btn-large" onClick={handleDriverLogin}>
                                        🚗 Driver Portal
                                    </button>
                                </div>
                            </div>
                            <div className="hero-visual">
                                <div className="app-mockup">
                                    <div className="mockup-screen">
                                        <div className="screen-content">
                                            <div className="bus-marker">🚌</div>
                                            <div className="route-line"></div>
                                            <div className="stops">
                                                <div className="stop active">A</div>
                                                <div className="stop">B</div>
                                                <div className="stop">C</div>
                                                <div className="stop">D</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose Chalo Bus?</h2>
                        <p className="section-subtitle">
                            Experience the future of public transportation with our comprehensive tracking solutions
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon primary">📍</div>
                            <h3 className="feature-title">Live Tracking</h3>
                            <p className="feature-description">
                                Real-time bus locations on interactive maps with accurate ETAs and route information.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon secondary">⏱️</div>
                            <h3 className="feature-title">Smart Scheduling</h3>
                            <p className="feature-description">
                                Intelligent arrival predictions and schedule optimization for better planning.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon primary">🚌</div>
                            <h3 className="feature-title">All Bus Types</h3>
                            <p className="feature-description">
                                Track both government and private buses across multiple routes and operators.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon secondary">📱</div>
                            <h3 className="feature-title">Mobile Friendly</h3>
                            <p className="feature-description">
                                Access our platform on any device with our responsive, mobile-first design.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon primary">🔔</div>
                            <h3 className="feature-title">Smart Alerts</h3>
                            <p className="feature-description">
                                Get notified when your bus is approaching or if there are route changes.
                            </p>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon secondary">📊</div>
                            <h3 className="feature-title">Live Analytics</h3>
                            <p className="feature-description">
                                Detailed insights into bus occupancy, speed, and estimated arrival times.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section" id="about">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">
                            Simple steps to track your bus in real-time
                        </p>
                    </div>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Select Your Route</h3>
                                <p>Choose from available bus routes or let us detect your location</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Track Live Location</h3>
                                <p>See your bus moving in real-time on the interactive map</p>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Get Accurate ETAs</h3>
                                <p>Receive precise arrival times and plan your journey accordingly</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Login Options Section */}
            <section className="login-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Get Started</h2>
                        <p className="section-subtitle">
                            Choose your role to access the platform
                        </p>
                    </div>

                    <div className="login-options-grid">
                        <div className="login-option-card" onClick={handleUserLogin}>
                            <div className="option-icon primary">👤</div>
                            <div className="option-content">
                                <h3>Passenger</h3>
                                <p>Track buses, find routes, and plan your journey</p>
                                <button className="btn btn-primary w-full">
                                    Passenger Login
                                </button>
                            </div>
                        </div>

                        <div className="login-option-card" onClick={handleDriverLogin}>
                            <div className="option-icon secondary">🚗</div>
                            <div className="option-content">
                                <h3>Driver</h3>
                                <p>Manage your bus, update location, and schedules</p>
                                <button className="btn btn-secondary w-full">
                                    Driver Login
                                </button>
                            </div>
                        </div>

                        <div className="login-option-card" onClick={handleAdminLogin}>
                            <div className="option-icon primary">👑</div>
                            <div className="option-content">
                                <h3>Admin</h3>
                                <p>System analytics, reports, and management</p>
                                <button className="btn btn-outline w-full">
                                    Admin Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">What Our Users Say</h2>
                        <p className="section-subtitle">
                            Discover how Chalo Bus is transforming daily commutes
                        </p>
                    </div>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                "This app has completely changed my daily commute. No more waiting at bus stops for hours!"
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">👤</div>
                                <div className="author-info">
                                    <div className="author-name">Rahul Sharma</div>
                                    <div className="author-role">Daily Commuter</div>
                                </div>
                            </div>
                        </div>
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                "As a bus driver, this system helps me manage my route efficiently and keep passengers informed."
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">🚗</div>
                                <div className="author-info">
                                    <div className="author-name">Priya Singh</div>
                                    <div className="author-role">Bus Driver</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Contact Us</h2>
                        <p className="section-subtitle">
                            Have questions? We'd love to hear from you
                        </p>
                    </div>
                    <div className="contact-content">
                        <div className="contact-info">
                            <div className="contact-item">
                                <div className="contact-icon">📧</div>
                                <div className="contact-details">
                                    <h3>Email</h3>
                                    <p>support@chalobus.com</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">📞</div>
                                <div className="contact-details">
                                    <h3>Phone</h3>
                                    <p>+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon">🏢</div>
                                <div className="contact-details">
                                    <h3>Office</h3>
                                    <p>123 Transport Nagar, City Center</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="welcome-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-main">
                            <div className="footer-section">
                                <div className="footer-logo">
                                    <h3>🚌 Chalo Bus</h3>
                                    <p>Your trusted partner for real-time bus tracking and smart commuting solutions.</p>
                                </div>
                                <div className="social-links">
                                    <a href="#" className="social-link">📘</a>
                                    <a href="#" className="social-link">🐦</a>
                                    <a href="#" className="social-link">📷</a>
                                    <a href="#" className="social-link">💼</a>
                                </div>
                            </div>

                            <div className="footer-section">
                                <h4>Quick Links</h4>
                                <ul className="footer-links">
                                    <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                                    <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About Us</a></li>
                                    <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
                                    <li><a href="#download">Download App</a></li>
                                </ul>
                            </div>

                            <div className="footer-section">
                                <h4>Services</h4>
                                <ul className="footer-links">
                                    <li><a href="#live-tracking">Live Bus Tracking</a></li>
                                    <li><a href="#route-planning">Route Planning</a></li>
                                    <li><a href="#schedule">Bus Schedule</a></li>
                                    <li><a href="#alerts">Smart Alerts</a></li>
                                </ul>
                            </div>

                            <div className="footer-section">
                                <h4>Support</h4>
                                <ul className="footer-links">
                                    <li><a href="#help">Help Center</a></li>
                                    <li><a href="#faq">FAQ</a></li>
                                    <li><a href="#privacy">Privacy Policy</a></li>
                                    <li><a href="#terms">Terms of Service</a></li>
                                </ul>
                            </div>

                            <div className="footer-section">
                                <h4>Contact Info</h4>
                                <div className="contact-info">
                                    <div className="contact-item">
                                        <span className="contact-icon">📧</span>
                                        <span>support@chalobus.com</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-icon">📞</span>
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div className="contact-item">
                                        <span className="contact-icon">🏢</span>
                                        <span>123 Transport Nagar, City Center</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="footer-bottom">
                            <div className="footer-bottom-content">
                                <div className="copyright">
                                    <p>&copy; 2024 Chalo Bus Tracking System. All rights reserved.</p>
                                </div>
                                <div className="footer-badges">
                                    <div className="badge">🚀 Fast & Reliable</div>
                                    <div className="badge">🔒 Secure</div>
                                    <div className="badge">⭐ 4.8/5 Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default WelcomePage;