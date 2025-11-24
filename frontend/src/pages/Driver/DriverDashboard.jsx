
// src/pages/Driver/DriverDashboard.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import './DriverDashboard.css';

const DriverDashboard = () => {
    const [activeTab, setActiveTab] = useState('register');
    const [formData, setFormData] = useState({
        busNumber: '',
        busName: '',
        busType: 'private',
        govtAgency: '',
        operatorName: '',
        contactNumber: '',
        route: {
            source: '',
            destination: '',
            totalDistance: '',
            totalDuration: '',
            totalFare: '',
            stops: [{
                stopName: '',
                stopOrder: 1,
                distanceFromSource: '',
                estimatedTimeFromSource: '',
                fareFromSource: ''
            }]
        },
        schedule: {
            firstTrip: '',
            lastTrip: '',
            frequency: '',
            operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        currentStatus: {
            isActive: true,
            availableToday: true
        }
    });

    const [myBuses, setMyBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Report states
    const [reports, setReports] = useState([]);
    const [reportLoading, setReportLoading] = useState(false);
    const [reportFormData, setReportFormData] = useState({
        busId: '',
        reportType: 'daily',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        incidentType: 'breakdown',
        description: '',
        severity: 'medium'
    });
    const [reportMessage, setReportMessage] = useState('');
    const [reportActiveTab, setReportActiveTab] = useState('generate');

    // Fetch driver's registered buses
    const fetchMyBuses = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('🟡 Fetching buses with token:', token);

            const response = await fetch('http://localhost:5000/api/buses/my-buses', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('🟡 Response status:', response.status);
            const result = await response.json();
            console.log('🟡 My buses result:', result);

            if (result.success) {
                setMyBuses(result.data || []);
                setError('');
            } else {
                setError(result.message || 'Failed to fetch buses');
                setMyBuses([]);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('🔴 Error fetching buses:', err);
            setMyBuses([]);
        }
    };

    // Fetch driver's reports
    const fetchMyReports = async () => {
        try {
            setReportLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/reports/my-reports', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            console.log('🟡 My reports result:', result);

            if (result.success) {
                setReports(result.data || []);
                setReportMessage('');
            } else {
                setReportMessage(result.message || 'Failed to fetch reports');
                setReports([]);
            }
        } catch (err) {
            setReportMessage('Network error. Please try again.');
            console.error('🔴 Error fetching reports:', err);
            setReports([]);
        } finally {
            setReportLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'manage') {
            fetchMyBuses();
        }
        if (activeTab === 'reports') {
            fetchMyBuses();
            fetchMyReports();
        }
    }, [activeTab]);

    // Bus Registration Functions
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleStopChange = (index, field, value) => {
        const updatedStops = [...formData.route.stops];
        updatedStops[index] = {
            ...updatedStops[index],
            [field]: field === 'stopOrder' || field === 'distanceFromSource' || field === 'fareFromSource'
                ? Number(value) : value
        };

        setFormData(prev => ({
            ...prev,
            route: {
                ...prev.route,
                stops: updatedStops
            }
        }));
    };

    const addStop = () => {
        setFormData(prev => ({
            ...prev,
            route: {
                ...prev.route,
                stops: [
                    ...prev.route.stops,
                    {
                        stopName: '',
                        stopOrder: prev.route.stops.length + 1,
                        distanceFromSource: '',
                        estimatedTimeFromSource: '',
                        fareFromSource: ''
                    }
                ]
            }
        }));
    };

    const removeStop = (index) => {
        if (formData.route.stops.length > 1) {
            const updatedStops = formData.route.stops.filter((_, i) => i !== index)
                .map((stop, idx) => ({ ...stop, stopOrder: idx + 1 }));

            setFormData(prev => ({
                ...prev,
                route: {
                    ...prev.route,
                    stops: updatedStops
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            console.log('🟡 Registering bus with data:', formData);

            const response = await fetch('http://localhost:5000/api/buses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            console.log('🟡 Registration result:', result);

            if (result.success) {
                setSuccess('Bus registered successfully!');
                // Reset form
                setFormData({
                    busNumber: '',
                    busName: '',
                    busType: 'private',
                    govtAgency: '',
                    operatorName: '',
                    contactNumber: '',
                    route: {
                        source: '',
                        destination: '',
                        totalDistance: '',
                        totalDuration: '',
                        totalFare: '',
                        stops: [{
                            stopName: '',
                            stopOrder: 1,
                            distanceFromSource: '',
                            estimatedTimeFromSource: '',
                            fareFromSource: ''
                        }]
                    },
                    schedule: {
                        firstTrip: '',
                        lastTrip: '',
                        frequency: '',
                        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                    },
                    currentStatus: {
                        isActive: true,
                        availableToday: true
                    }
                });
                // Refresh bus list
                fetchMyBuses();
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('🔴 Registration error:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleBusAvailability = async (busId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/buses/${busId}/availability`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    availableToday: !currentStatus
                })
            });

            const result = await response.json();

            if (result.success) {
                fetchMyBuses();
                setSuccess(`Bus ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
                setError('');
            } else {
                setError(result.message || 'Update failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        }
    };

    const handleUpdateBus = (busId) => {
        setSuccess(`Update functionality for bus ${busId} will be implemented soon!`);
    };

    // Report Functions
    const handleReportInputChange = (e) => {
        const { name, value } = e.target;
        setReportFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateReport = async (e) => {
        e.preventDefault();
        if (!reportFormData.busId) {
            setReportMessage('Please select a bus');
            return;
        }

        setReportLoading(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = reportFormData.reportType === 'daily'
                ? '/api/reports/daily'
                : '/api/reports/performance';

            const payload = reportFormData.reportType === 'daily'
                ? {
                    busId: reportFormData.busId,
                    date: reportFormData.startDate
                }
                : {
                    busId: reportFormData.busId,
                    startDate: reportFormData.startDate,
                    endDate: reportFormData.endDate
                };

            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('🟡 Report generation result:', result);

            if (result.success) {
                setReportMessage('✅ Report generated successfully!');
                fetchMyReports();
                setReportFormData(prev => ({
                    ...prev,
                    description: '',
                    busId: reportFormData.reportType === 'performance' ? '' : prev.busId
                }));
            } else {
                setReportMessage('❌ ' + (result.message || 'Failed to generate report'));
            }
        } catch (err) {
            setReportMessage('❌ Network error. Please try again.');
            console.error('🔴 Report generation error:', err);
        } finally {
            setReportLoading(false);
        }
    };

    const reportIncident = async (e) => {
        e.preventDefault();
        if (!reportFormData.busId || !reportFormData.description) {
            setReportMessage('Please fill all required fields');
            return;
        }

        setReportLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/reports/incident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    busId: reportFormData.busId,
                    incidentType: reportFormData.incidentType,
                    description: reportFormData.description,
                    severity: reportFormData.severity
                })
            });

            const result = await response.json();
            console.log('🟡 Incident report result:', result);

            if (result.success) {
                setReportMessage('✅ Incident reported successfully!');
                fetchMyReports();
                setReportFormData(prev => ({
                    ...prev,
                    description: ''
                }));
            } else {
                setReportMessage('❌ ' + (result.message || 'Failed to report incident'));
            }
        } catch (err) {
            setReportMessage('❌ Network error. Please try again.');
            console.error('🔴 Incident report error:', err);
        } finally {
            setReportLoading(false);
        }
    };

    const deleteReport = async (reportId) => {
        if (!window.confirm('Are you sure you want to delete this report?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (result.success) {
                setReportMessage('✅ Report deleted successfully!');
                fetchMyReports();
            } else {
                setReportMessage('❌ ' + (result.message || 'Failed to delete report'));
            }
        } catch (err) {
            setReportMessage('❌ Network error. Please try again.');
            console.error('🔴 Delete report error:', err);
        }
    };

    const getReportIcon = (type) => {
        const icons = {
            daily: '📅',
            performance: '📈',
            incident: '⚠️',
            maintenance: '🔧',
            financial: '💰'
        };
        return icons[type] || '📄';
    };

    return (
        <div className="driver-dashboard">
            <Navbar />

            <main className="dashboard-main">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <div className="welcome-avatar">
                            <span className="avatar-icon">🚗</span>
                        </div>
                        <div className="welcome-text">
                            <h1>Welcome back, {user.name}!</h1>
                            <p>Manage your buses and track performance</p>
                        </div>
                        <div className="welcome-stats">
                            <div className="stat-card">
                                <span className="stat-icon">🚌</span>
                                <div className="stat-info">
                                    <span className="stat-number">{myBuses.length}</span>
                                    <span className="stat-label">Total Buses</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="dashboard-nav">
                    <div className="nav-container">
                        <button
                            className={`nav-btn ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            <span className="nav-icon">📝</span>
                            <span className="nav-text">Register Bus</span>
                        </button>
                        <button
                            className={`nav-btn ${activeTab === 'manage' ? 'active' : ''}`}
                            onClick={() => setActiveTab('manage')}
                        >
                            <span className="nav-icon">🚌</span>
                            <span className="nav-text">My Buses</span>
                            {myBuses.length > 0 && (
                                <span className="nav-badge">{myBuses.length}</span>
                            )}
                        </button>
                        <button
                            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                            onClick={() => setActiveTab('reports')}
                        >
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Reports</span>
                        </button>
                    </div>
                </nav>

                <div className="tab-content">
                    {/* Register Bus Tab */}
                    {activeTab === 'register' && (
                        <div className="registration-section">
                            <div className="section-header">
                                <h2>Register New Bus</h2>
                                <p>Add your bus details and route information</p>
                            </div>

                            {error && <div className="alert alert-error">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <form onSubmit={handleSubmit} className="bus-registration-form">
                                {/* Basic Bus Information */}
                                <div className="form-card">
                                    <div className="form-card-header">
                                        <span className="form-icon">🚗</span>
                                        <h3>Basic Bus Information</h3>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Bus Number *</label>
                                            <input
                                                type="text"
                                                name="busNumber"
                                                value={formData.busNumber}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., TN1234"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bus Name/Route Name *</label>
                                            <input
                                                type="text"
                                                name="busName"
                                                value={formData.busName}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Ragavendra Express"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bus Type *</label>
                                            <select
                                                name="busType"
                                                value={formData.busType}
                                                onChange={handleInputChange}
                                                required
                                                className="form-select"
                                            >
                                                <option value="private">Private</option>
                                                <option value="government">Government</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Conditional Fields */}
                                    {formData.busType === 'government' && (
                                        <div className="form-group">
                                            <label>Government Agency *</label>
                                            <input
                                                type="text"
                                                name="govtAgency"
                                                value={formData.govtAgency}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., TNSTC"
                                                className="form-input"
                                            />
                                        </div>
                                    )}

                                    {formData.busType === 'private' && (
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Operator Name *</label>
                                                <input
                                                    type="text"
                                                    name="operatorName"
                                                    value={formData.operatorName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="e.g., Ragavendra Travels"
                                                    className="form-input"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Contact Number</label>
                                                <input
                                                    type="tel"
                                                    name="contactNumber"
                                                    value={formData.contactNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="e.g., 9876543210"
                                                    className="form-input"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Availability Toggle */}
                                    <div className="toggle-group">
                                        <label className="toggle-label">
                                            <div className="toggle-container">
                                                <input
                                                    type="checkbox"
                                                    name="currentStatus.availableToday"
                                                    checked={formData.currentStatus.availableToday}
                                                    onChange={handleInputChange}
                                                    className="toggle-input"
                                                />
                                                <span className="toggle-slider"></span>
                                            </div>
                                            <div className="toggle-text">
                                                <span className="toggle-title">Available Today</span>
                                                <span className="toggle-subtitle">
                                                    {formData.currentStatus.availableToday ?
                                                        '✅ Bus will appear in search results' :
                                                        '❌ Bus will be hidden from search results'}
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Route Information */}
                                <div className="form-card">
                                    <div className="form-card-header">
                                        <span className="form-icon">📍</span>
                                        <h3>Route Information</h3>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Source *</label>
                                            <input
                                                type="text"
                                                name="route.source"
                                                value={formData.route.source}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Pollachi"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Destination *</label>
                                            <input
                                                type="text"
                                                name="route.destination"
                                                value={formData.route.destination}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Coimbatore"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Total Distance (km) *</label>
                                            <input
                                                type="number"
                                                name="route.totalDistance"
                                                value={formData.route.totalDistance}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., 45"
                                                step="0.1"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Total Duration *</label>
                                            <input
                                                type="text"
                                                name="route.totalDuration"
                                                value={formData.route.totalDuration}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., 1 hour 15 mins"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Total Fare (₹) *</label>
                                            <input
                                                type="number"
                                                name="route.totalFare"
                                                value={formData.route.totalFare}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., 60"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>

                                    {/* Bus Stops */}
                                    <div className="stops-section">
                                        <div className="section-header">
                                            <h4>Bus Stops (Intermediate Stops)</h4>
                                            <button type="button" onClick={addStop} className="btn-secondary">
                                                <span className="btn-icon">+</span>
                                                Add Stop
                                            </button>
                                        </div>
                                        <div className="stops-help">
                                            <span className="help-icon">💡</span>
                                            <p>Add all intermediate stops. Users can search between ANY stops!</p>
                                            <p className="help-example">Example: Pollachi → Ukkadam → Kinathukadavu → Coimbatore</p>
                                        </div>

                                        {formData.route.stops.map((stop, index) => (
                                            <div key={index} className="stop-card">
                                                <div className="stop-header">
                                                    <div className="stop-title">
                                                        <span className="stop-number">Stop {index + 1}</span>
                                                        <span className="stop-marker">{stop.stopOrder}</span>
                                                    </div>
                                                    {formData.route.stops.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStop(index)}
                                                            className="btn-danger"
                                                        >
                                                            <span className="btn-icon">🗑️</span>
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="stop-form-grid">
                                                    <div className="form-group">
                                                        <label>Stop Name *</label>
                                                        <input
                                                            type="text"
                                                            value={stop.stopName}
                                                            onChange={(e) => handleStopChange(index, 'stopName', e.target.value)}
                                                            required
                                                            placeholder="e.g., Ukkadam"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Distance from Source (km) *</label>
                                                        <input
                                                            type="number"
                                                            value={stop.distanceFromSource}
                                                            onChange={(e) => handleStopChange(index, 'distanceFromSource', e.target.value)}
                                                            required
                                                            placeholder="e.g., 25"
                                                            step="0.1"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Estimated Time from Source *</label>
                                                        <input
                                                            type="text"
                                                            value={stop.estimatedTimeFromSource}
                                                            onChange={(e) => handleStopChange(index, 'estimatedTimeFromSource', e.target.value)}
                                                            required
                                                            placeholder="e.g., 45 mins"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Fare from Source (₹) *</label>
                                                        <input
                                                            type="number"
                                                            value={stop.fareFromSource}
                                                            onChange={(e) => handleStopChange(index, 'fareFromSource', e.target.value)}
                                                            required
                                                            placeholder="e.g., 35"
                                                            className="form-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Schedule Information */}
                                <div className="form-card">
                                    <div className="form-card-header">
                                        <span className="form-icon">⏰</span>
                                        <h3>Schedule Information</h3>
                                    </div>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>First Trip *</label>
                                            <input
                                                type="text"
                                                name="schedule.firstTrip"
                                                value={formData.schedule.firstTrip}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., 06:00 AM"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Last Trip *</label>
                                            <input
                                                type="text"
                                                name="schedule.lastTrip"
                                                value={formData.schedule.lastTrip}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., 10:00 PM"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Frequency *</label>
                                            <input
                                                type="text"
                                                name="schedule.frequency"
                                                value={formData.schedule.frequency}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g., Every 30 minutes"
                                                className="form-input"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="submit" className="btn-primary btn-large" disabled={loading}>
                                        <span className="btn-icon">{loading ? '⏳' : '🚗'}</span>
                                        {loading ? 'Registering Bus...' : 'Register Bus'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* My Buses Tab */}
                    {activeTab === 'manage' && (
                        <div className="management-section">
                            <div className="section-header">
                                <h2>My Registered Buses</h2>
                                <p>Manage your bus fleet and availability</p>
                            </div>

                            {error && <div className="alert alert-error">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            {myBuses.length === 0 ? (
                                <div className="empty-state">
                                    <div className="empty-icon">🚌</div>
                                    <h3>No Buses Registered</h3>
                                    <p>Register your first bus to get started</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setActiveTab('register')}
                                    >
                                        Register Your First Bus
                                    </button>
                                </div>
                            ) : (
                                <div className="buses-grid">
                                    {myBuses.map(bus => (
                                        <div key={bus._id} className="bus-card">
                                            <div className="bus-card-header">
                                                <div className="bus-info">
                                                    <h4 className="bus-name">{bus.busName}</h4>
                                                    <div className="bus-meta">
                                                        <span className="bus-number">{bus.busNumber}</span>
                                                        <span className={`bus-type ${bus.busType}`}>
                                                            {bus.busType === 'government' ? '🏛️ Govt' : '🏢 Private'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bus-actions">
                                                    <button
                                                        className={`status-toggle ${bus.currentStatus.availableToday ? 'active' : 'inactive'}`}
                                                        onClick={() => toggleBusAvailability(bus._id, bus.currentStatus.availableToday)}
                                                    >
                                                        <span className="status-dot"></span>
                                                        {bus.currentStatus.availableToday ? 'Available' : 'Not Available'}
                                                    </button>
                                                    <button
                                                        className="btn-secondary btn-small"
                                                        onClick={() => handleUpdateBus(bus._id)}
                                                    >
                                                        <span className="btn-icon">✏️</span>
                                                        Update
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bus-details">
                                                <div className="detail-item">
                                                    <span className="detail-icon">📍</span>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Route</span>
                                                        <span className="detail-value">{bus.route.source} → {bus.route.destination}</span>
                                                    </div>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-icon">⏰</span>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Schedule</span>
                                                        <span className="detail-value">{bus.schedule.firstTrip} - {bus.schedule.lastTrip}</span>
                                                    </div>
                                                </div>
                                                <div className="detail-item">
                                                    <span className="detail-icon">🔄</span>
                                                    <div className="detail-content">
                                                        <span className="detail-label">Frequency</span>
                                                        <span className="detail-value">{bus.schedule.frequency}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stops Timeline */}
                                            <div className="stops-timeline">
                                                <div className="timeline-header">
                                                    <h5>Route Stops</h5>
                                                    <span className="stops-count">{bus.route.stops.length} stops</span>
                                                </div>
                                                <div className="timeline">
                                                    {bus.route.stops.map((stop, index) => (
                                                        <div key={index} className="timeline-item">
                                                            <div className="timeline-marker">
                                                                <div className="marker-circle">{index + 1}</div>
                                                                {index < bus.route.stops.length - 1 && <div className="timeline-line"></div>}
                                                            </div>
                                                            <div className="timeline-content">
                                                                <div className="stop-name">{stop.stopName}</div>
                                                                <div className="stop-details">
                                                                    <span>{stop.distanceFromSource} km</span>
                                                                    <span>₹{stop.fareFromSource}</span>
                                                                    <span>{stop.estimatedTimeFromSource}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="reports-section">
                            <div className="section-header">
                                <h2>Reports Dashboard</h2>
                                <p>Generate reports and track bus performance</p>
                            </div>

                            {reportMessage && (
                                <div className={`alert ${reportMessage.includes('✅') ? 'alert-success' : 'alert-error'}`}>
                                    {reportMessage}
                                </div>
                            )}

                            {/* Report Tabs */}
                            <div className="report-tabs">
                                <button
                                    className={`report-tab ${reportActiveTab === 'generate' ? 'active' : ''}`}
                                    onClick={() => setReportActiveTab('generate')}
                                >
                                    <span className="tab-icon">📊</span>
                                    <span className="tab-text">Generate Report</span>
                                </button>
                                <button
                                    className={`report-tab ${reportActiveTab === 'incident' ? 'active' : ''}`}
                                    onClick={() => setReportActiveTab('incident')}
                                >
                                    <span className="tab-icon">⚠️</span>
                                    <span className="tab-text">Report Incident</span>
                                </button>
                                <button
                                    className={`report-tab ${reportActiveTab === 'view' ? 'active' : ''}`}
                                    onClick={() => setReportActiveTab('view')}
                                >
                                    <span className="tab-icon">📋</span>
                                    <span className="tab-text">My Reports</span>
                                    {reports.length > 0 && (
                                        <span className="tab-badge">{reports.length}</span>
                                    )}
                                </button>
                            </div>

                            <div className="report-content">
                                {/* Generate Report Tab */}
                                {reportActiveTab === 'generate' && (
                                    <div className="report-form-card">
                                        <div className="form-card-header">
                                            <span className="form-icon">📊</span>
                                            <h3>Generate New Report</h3>
                                        </div>
                                        <form onSubmit={generateReport}>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Select Bus</label>
                                                    <select
                                                        name="busId"
                                                        value={reportFormData.busId}
                                                        onChange={handleReportInputChange}
                                                        required
                                                        className="form-select"
                                                    >
                                                        <option value="">Choose a bus</option>
                                                        {myBuses.map(bus => (
                                                            <option key={bus._id} value={bus._id}>
                                                                {bus.busName} ({bus.busNumber})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Report Type</label>
                                                    <select
                                                        name="reportType"
                                                        value={reportFormData.reportType}
                                                        onChange={handleReportInputChange}
                                                        className="form-select"
                                                    >
                                                        <option value="daily">Daily Report</option>
                                                        <option value="performance">Performance Report</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>
                                                        {reportFormData.reportType === 'daily' ? 'Date' : 'Start Date'}
                                                    </label>
                                                    <input
                                                        type="date"
                                                        name="startDate"
                                                        value={reportFormData.startDate}
                                                        onChange={handleReportInputChange}
                                                        required
                                                        className="form-input"
                                                    />
                                                </div>

                                                {reportFormData.reportType === 'performance' && (
                                                    <div className="form-group">
                                                        <label>End Date</label>
                                                        <input
                                                            type="date"
                                                            name="endDate"
                                                            value={reportFormData.endDate}
                                                            onChange={handleReportInputChange}
                                                            required
                                                            className="form-input"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit" disabled={reportLoading} className="btn-primary">
                                                    <span className="btn-icon">{reportLoading ? '⏳' : '📊'}</span>
                                                    {reportLoading ? 'Generating...' : 'Generate Report'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Incident Report Tab */}
                                {reportActiveTab === 'incident' && (
                                    <div className="report-form-card">
                                        <div className="form-card-header">
                                            <span className="form-icon">⚠️</span>
                                            <h3>Report Incident</h3>
                                        </div>
                                        <form onSubmit={reportIncident}>
                                            <div className="form-grid">
                                                <div className="form-group">
                                                    <label>Select Bus</label>
                                                    <select
                                                        name="busId"
                                                        value={reportFormData.busId}
                                                        onChange={handleReportInputChange}
                                                        required
                                                        className="form-select"
                                                    >
                                                        <option value="">Choose a bus</option>
                                                        {myBuses.map(bus => (
                                                            <option key={bus._id} value={bus._id}>
                                                                {bus.busName} ({bus.busNumber})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Incident Type</label>
                                                    <select
                                                        name="incidentType"
                                                        value={reportFormData.incidentType}
                                                        onChange={handleReportInputChange}
                                                        className="form-select"
                                                    >
                                                        <option value="breakdown">Breakdown</option>
                                                        <option value="accident">Accident</option>
                                                        <option value="delay">Major Delay</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>

                                                <div className="form-group">
                                                    <label>Severity</label>
                                                    <select
                                                        name="severity"
                                                        value={reportFormData.severity}
                                                        onChange={handleReportInputChange}
                                                        className="form-select"
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    name="description"
                                                    value={reportFormData.description}
                                                    onChange={handleReportInputChange}
                                                    placeholder="Describe the incident in detail..."
                                                    rows="4"
                                                    required
                                                    className="form-textarea"
                                                />
                                            </div>

                                            <div className="form-actions">
                                                <button type="submit" disabled={reportLoading} className="btn-primary">
                                                    <span className="btn-icon">{reportLoading ? '⏳' : '⚠️'}</span>
                                                    {reportLoading ? 'Reporting...' : 'Report Incident'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* View Reports Tab */}
                                {reportActiveTab === 'view' && (
                                    <div className="reports-grid">
                                        {reportLoading ? (
                                            <div className="loading-state">
                                                <div className="loading-spinner"></div>
                                                <p>Loading reports...</p>
                                            </div>
                                        ) : reports.length === 0 ? (
                                            <div className="empty-state">
                                                <div className="empty-icon">📊</div>
                                                <h3>No Reports Found</h3>
                                                <p>Generate your first report to see it here!</p>
                                            </div>
                                        ) : (
                                            reports.map(report => (
                                                <div key={report._id} className="report-card">
                                                    <div className="report-card-header">
                                                        <div className="report-title">
                                                            <span className="report-icon">
                                                                {getReportIcon(report.reportType)}
                                                            </span>
                                                            <h4>{report.title}</h4>
                                                        </div>
                                                        <button
                                                            className="btn-danger btn-small"
                                                            onClick={() => deleteReport(report._id)}
                                                        >
                                                            <span className="btn-icon">🗑️</span>
                                                        </button>
                                                    </div>

                                                    <div className="report-content">
                                                        <div className="report-meta">
                                                            <div className="meta-item">
                                                                <span className="meta-label">Bus:</span>
                                                                <span className="meta-value">{report.bus?.busName} ({report.bus?.busNumber})</span>
                                                            </div>
                                                            <div className="meta-item">
                                                                <span className="meta-label">Type:</span>
                                                                <span className="meta-value">{report.reportType}</span>
                                                            </div>
                                                            <div className="meta-item">
                                                                <span className="meta-label">Date:</span>
                                                                <span className="meta-value">{new Date(report.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>

                                                        {report.data && (
                                                            <div className="report-metrics">
                                                                <div className="metric">
                                                                    <span className="metric-value">{report.data.totalTrips || 0}</span>
                                                                    <span className="metric-label">Trips</span>
                                                                </div>
                                                                <div className="metric">
                                                                    <span className="metric-value">₹{report.data.totalRevenue || 0}</span>
                                                                    <span className="metric-label">Revenue</span>
                                                                </div>
                                                                <div className="metric">
                                                                    <span className="metric-value">{report.data.totalPassengers || 0}</span>
                                                                    <span className="metric-label">Passengers</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default DriverDashboard;