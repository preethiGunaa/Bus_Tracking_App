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

    useEffect(() => {
        if (activeTab === 'manage') {
            fetchMyBuses();
        }
    }, [activeTab]);

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
                // Reset form and refresh bus list
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
                // Switch to manage tab and refresh list
                setActiveTab('manage');
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
                fetchMyBuses(); // Refresh list
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
        // For now, just show a message - you can implement full update functionality later
        setSuccess(`Update functionality for bus ${busId} will be implemented soon!`);
    };

    return (
        <div className="driver-dashboard">
            <Navbar />

            <main className="dashboard-main">
                <div className="welcome-section">
                    <h1>Welcome, Driver {user.name}! 🚗</h1>
                    <p>Register your bus and manage your routes</p>
                </div>

                {/* Navigation Tabs */}
                <nav className="dashboard-nav">
                    <button
                        className={`nav-btn ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        📝 Register Bus
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'manage' ? 'active' : ''}`}
                        onClick={() => setActiveTab('manage')}
                    >
                        🚌 My Buses ({myBuses.length})
                    </button>
                </nav>

                <div className="tab-content">
                    {activeTab === 'register' && (
                        <div className="registration-section">
                            <h2>Register Your Bus</h2>

                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}

                            <form onSubmit={handleSubmit} className="bus-registration-form">
                                {/* Basic Bus Information */}
                                <div className="form-section">
                                    <h3>Basic Bus Information</h3>
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
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Bus Type *</label>
                                            <select
                                                name="busType"
                                                value={formData.busType}
                                                onChange={handleInputChange}
                                                required
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
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Availability Toggle */}
                                    <div className="availability-toggle">
                                        <label className="toggle-label">
                                            <input
                                                type="checkbox"
                                                name="currentStatus.availableToday"
                                                checked={formData.currentStatus.availableToday}
                                                onChange={handleInputChange}
                                            />
                                            <span className="toggle-slider"></span>
                                            Available Today
                                        </label>
                                        <span className="toggle-help">
                                            {formData.currentStatus.availableToday ?
                                                '✅ Bus will appear in search results' :
                                                '❌ Bus will be hidden from search results'}
                                        </span>
                                    </div>
                                </div>

                                {/* Route Information */}
                                <div className="form-section">
                                    <h3>Route Information</h3>
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
                                            />
                                        </div>
                                    </div>

                                    {/* Bus Stops */}
                                    <div className="stops-section">
                                        <div className="section-header">
                                            <h4>Bus Stops (Intermediate Stops)</h4>
                                            <button type="button" onClick={addStop} className="add-stop-btn">
                                                + Add Stop
                                            </button>
                                        </div>
                                        <p className="stops-help">
                                            💡 Add all intermediate stops. Users can search between ANY stops!<br />
                                            Example: Pollachi → Ukkadam → Kinathukadavu → Coimbatore
                                        </p>

                                        {formData.route.stops.map((stop, index) => (
                                            <div key={index} className="stop-card">
                                                <div className="stop-header">
                                                    <h5>Stop {index + 1}</h5>
                                                    {formData.route.stops.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeStop(index)}
                                                            className="remove-stop-btn"
                                                        >
                                                            🗑️ Remove
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
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Schedule Information */}
                                <div className="form-section">`32`
                                    <h3>Schedule Information</h3>
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
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Registering Bus...' : '🚗 Register Bus'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'manage' && (
                        <div className="management-section">
                            <h2>My Registered Buses</h2>

                            {error && <div className="error-message">{error}</div>}
                            {success && <div className="success-message">{success}</div>}

                            {myBuses.length === 0 ? (
                                <div className="no-buses">
                                    <div className="no-buses-icon">🚌</div>
                                    <h3>No Buses Registered</h3>
                                    <p>Register your first bus to get started</p>
                                    <button
                                        className="register-first-btn"
                                        onClick={() => setActiveTab('register')}
                                    >
                                        Register Your First Bus
                                    </button>
                                </div>
                            ) : (
                                <div className="buses-list">
                                    {myBuses.map(bus => (
                                        <div key={bus._id} className="bus-management-card">
                                            <div className="bus-header">
                                                <div className="bus-basic-info">
                                                    <h4>{bus.busName}</h4>
                                                    <span className="bus-number">{bus.busNumber}</span>
                                                    <span className={`bus-type ${bus.busType}`}>
                                                        {bus.busType === 'government' ? '🏛️ Govt' : '🏢 Private'}
                                                    </span>
                                                </div>
                                                <div className="bus-actions">
                                                    <button
                                                        className={`availability-btn ${bus.currentStatus.availableToday ? 'active' : 'inactive'}`}
                                                        onClick={() => toggleBusAvailability(bus._id, bus.currentStatus.availableToday)}
                                                    >
                                                        {bus.currentStatus.availableToday ? '🟢 Available' : '🔴 Not Available'}
                                                    </button>
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleUpdateBus(bus._id)}
                                                    >
                                                        ✏️ Update Details
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bus-details">
                                                <div className="route-info">
                                                    <strong>Route:</strong> {bus.route.source} → {bus.route.destination}
                                                </div>
                                                <div className="schedule-info">
                                                    <strong>Schedule:</strong> {bus.schedule.firstTrip} - {bus.schedule.lastTrip} ({bus.schedule.frequency})
                                                </div>
                                                <div className="stops-info">
                                                    <strong>Total Stops:</strong> {bus.route.stops.length} stops
                                                </div>
                                                <div className="status-info">
                                                    <strong>Current Status:</strong>
                                                    <span className={`status ${bus.currentStatus.availableToday ? 'available' : 'unavailable'}`}>
                                                        {bus.currentStatus.availableToday ? 'Available for Booking' : 'Not Available Today'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Show all stops */}
                                            <div className="stops-list">
                                                <h5>All Stops (Route Path):</h5>
                                                <div className="stops-timeline">
                                                    {bus.route.stops.map((stop, index) => (
                                                        <div key={index} className="stop-item">
                                                            <div className="stop-marker">{index + 1}</div>
                                                            <div className="stop-details">
                                                                <strong>{stop.stopName}</strong>
                                                                <span>{stop.distanceFromSource} km • ₹{stop.fareFromSource} • {stop.estimatedTimeFromSource}</span>
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
                </div>
            </main>
        </div>
    );
};

export default DriverDashboard;