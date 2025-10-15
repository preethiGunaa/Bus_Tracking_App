// src/pages/Dashboard/UserDashboard.jsx
import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import './UserDashboard.css';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('track');
    const [searchData, setSearchData] = useState({
        source: '',
        destination: '',
        busType: '' // 'government', 'private', or '' for all
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedBus, setSelectedBus] = useState(null); // For showing bus details
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleSearchChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };

    const handleSearchBuses = async (e) => {
        e.preventDefault();

        if (!searchData.source.trim() || !searchData.destination.trim()) {
            setError('Please enter both source and destination');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Build query parameters
            const params = new URLSearchParams({
                source: searchData.source.trim(),
                destination: searchData.destination.trim()
            });

            if (searchData.busType) {
                params.append('busType', searchData.busType);
            }

            const response = await fetch(`http://localhost:5000/api/buses/search?${params}`);
            const result = await response.json();

            console.log('🟡 Search result:', result); // Debug log

            if (result.success) {
                setSearchResults(result.data || []);

                if (result.data.length === 0) {
                    setError('No buses found for this route. Try different locations or check back later.');
                } else {
                    setError('');
                }
            } else {
                setError(result.message || 'Search failed');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('🔴 Search error:', err);
            setError('Network error. Please try again.');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBusTypeFilter = (type) => {
        setSearchData({
            ...searchData,
            busType: type
        });
    };

    const clearSearch = () => {
        setSearchData({
            source: '',
            destination: '',
            busType: ''
        });
        setSearchResults([]);
        setError('');
        setSelectedBus(null);
    };

    // Function to handle "See Full Details" button click
    const handleSeeFullDetails = async (bus) => {
        try {
            // Fetch complete bus details including stops
            const response = await fetch(`http://localhost:5000/api/buses/${bus._id}/stops`);
            const result = await response.json();

            if (result.success) {
                setSelectedBus(result.data);
            } else {
                setError('Failed to load bus details');
            }
        } catch (err) {
            console.error('🔴 Error fetching bus details:', err);
            setError('Network error while loading bus details');
        }
    };

    // Function to close bus details modal
    const closeBusDetails = () => {
        setSelectedBus(null);
    };

    return (
        <div className="user-dashboard">
            {/* Navbar Component */}
            <Navbar />

            {/* Main Dashboard Content */}
            <main className="dashboard-main">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <h1>Welcome back, {user.name}! 👋</h1>
                    <p>Track your buses and plan your journey</p>
                </div>

                {/* Navigation Tabs */}
                <nav className="dashboard-nav">
                    <button
                        className={`nav-btn ${activeTab === 'track' ? 'active' : ''}`}
                        onClick={() => setActiveTab('track')}
                    >
                        🗺️ Track Bus
                    </button>

                    <button
                        className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        📜 Journey History
                    </button>
                </nav>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'track' && (
                        <div className="tracking-section">
                            <h2>Search Available Buses</h2>

                            {/* Search Form */}
                            <form onSubmit={handleSearchBuses} className="search-form">
                                <div className="search-inputs">
                                    <div className="form-group">
                                        <label htmlFor="source">From (Source)</label>
                                        <input
                                            type="text"
                                            id="source"
                                            name="source"
                                            value={searchData.source}
                                            onChange={handleSearchChange}
                                            placeholder="Enter starting point..."
                                            className="search-input"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="destination">To (Destination)</label>
                                        <input
                                            type="text"
                                            id="destination"
                                            name="destination"
                                            value={searchData.destination}
                                            onChange={handleSearchChange}
                                            placeholder="Enter destination..."
                                            className="search-input"
                                        />
                                    </div>
                                </div>

                                {/* Bus Type Filter Buttons */}
                                <div className="bus-type-filter">
                                    <h4>Filter by Bus Type:</h4>
                                    <div className="filter-buttons">
                                        <button
                                            type="button"
                                            className={`filter-btn ${searchData.busType === '' ? 'active' : ''}`}
                                            onClick={() => handleBusTypeFilter('')}
                                        >
                                            🚌 All Buses
                                        </button>
                                        <button
                                            type="button"
                                            className={`filter-btn ${searchData.busType === 'government' ? 'active' : ''}`}
                                            onClick={() => handleBusTypeFilter('government')}
                                        >
                                            🏛️ Government
                                        </button>
                                        <button
                                            type="button"
                                            className={`filter-btn ${searchData.busType === 'private' ? 'active' : ''}`}
                                            onClick={() => handleBusTypeFilter('private')}
                                        >
                                            🏢 Private
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="search-actions">
                                    <button
                                        type="submit"
                                        className="search-btn primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Searching...' : '🔍 Search Buses'}
                                    </button>
                                    <button
                                        type="button"
                                        className="search-btn secondary"
                                        onClick={clearSearch}
                                    >
                                        🗑️ Clear
                                    </button>
                                </div>
                            </form>

                            {/* Error Message */}
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    <h3>Available Buses ({searchResults.length})</h3>
                                    <div className="buses-grid">
                                        {searchResults.map(bus => (
                                            <div key={bus._id} className="bus-card">
                                                <div className="bus-header">
                                                    <h4>{bus.busName}</h4>
                                                    <span className={`bus-type ${bus.busType}`}>
                                                        {bus.busType === 'government' ? '🏛️ Govt' : '🏢 Private'}
                                                    </span>
                                                </div>

                                                <div className="bus-info">
                                                    <p className="bus-number">
                                                        <strong>Bus No:</strong> {bus.busNumber}
                                                    </p>
                                                    <p className="route">
                                                        <strong>Route:</strong> {bus.route.source} → {bus.route.destination}
                                                    </p>
                                                    <p className="operator">
                                                        <strong>Operator:</strong> {bus.busType === 'government' ? bus.govtAgency : bus.operatorName}
                                                    </p>
                                                    <p className="schedule">
                                                        <strong>Schedule:</strong> {bus.schedule.firstTrip} - {bus.schedule.lastTrip}
                                                    </p>
                                                    <p className="frequency">
                                                        <strong>Frequency:</strong> Every {bus.schedule.frequency}
                                                    </p>
                                                </div>

                                                {/* Single Action Button */}
                                                <div className="bus-actions">
                                                    <button
                                                        className="action-btn details-btn"
                                                        onClick={() => handleSeeFullDetails(bus)}
                                                    >
                                                        📋 See Full Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results Message */}
                            {searchResults.length === 0 && !loading && !error && (
                                <div className="no-results">
                                    <div className="no-results-icon">🚌</div>
                                    <h3>Search for Buses</h3>
                                    <p>Enter source and destination to find available buses</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Keep existing routes and history sections */}
                    {activeTab === 'routes' && (
                        <div className="routes-section">
                            {/* ... existing routes content ... */}
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-section">
                            {/* ... existing history content ... */}
                        </div>
                    )}
                </div>
            </main>

            {/* Bus Details Modal */}
            {selectedBus && (
                <div className="modal-overlay" onClick={closeBusDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🚌 {selectedBus.busName} - Full Details</h2>
                            <button className="close-btn" onClick={closeBusDetails}>✕</button>
                        </div>

                        <div className="modal-body">
                            {/* Basic Bus Information */}
                            <div className="bus-basic-info">
                                <h3>Bus Information</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <strong>Bus Number:</strong> {selectedBus.busNumber}
                                    </div>
                                    <div className="info-item">
                                        <strong>Route:</strong> {selectedBus.route?.source} → {selectedBus.route?.destination}
                                    </div>
                                    <div className="info-item">
                                        <strong>Operator:</strong> {selectedBus.busType === 'government' ? selectedBus.govtAgency : selectedBus.operatorName}
                                    </div>
                                    <div className="info-item">
                                        <strong>Schedule:</strong> {selectedBus.schedule?.firstTrip} - {selectedBus.schedule?.lastTrip}
                                    </div>
                                    <div className="info-item">
                                        <strong>Frequency:</strong> Every {selectedBus.schedule?.frequency}
                                    </div>
                                </div>
                            </div>

                            {/* Stops Information */}
                            <div className="stops-section">
                                <h3>🛑 Bus Stops & Fare Details</h3>
                                <div className="stops-list">
                                    {selectedBus.stops && selectedBus.stops.map((stop, index) => (
                                        <div key={index} className="stop-item">
                                            <div className="stop-header">
                                                <span className="stop-name">{stop.stopName}</span>
                                                <span className="stop-fare">₹{stop.fareFromSource}</span>
                                            </div>
                                            <div className="stop-details">
                                                <span className="stop-order">Stop #{stop.stopOrder}</span>
                                                <span className="stop-distance">{stop.distanceFromSource} km</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Route Summary */}
                            <div className="route-summary">
                                <h3>📊 Route Summary</h3>
                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <strong>Total Stops:</strong> {selectedBus.stops?.length || 0}
                                    </div>
                                    <div className="summary-item">
                                        <strong>Total Distance:</strong> {selectedBus.stops && selectedBus.stops.length > 0
                                            ? `${selectedBus.stops[selectedBus.stops.length - 1].distanceFromSource} km`
                                            : 'N/A'}
                                    </div>
                                    <div className="summary-item">
                                        <strong>Total Fare:</strong> {selectedBus.stops && selectedBus.stops.length > 0
                                            ? `₹${selectedBus.stops[selectedBus.stops.length - 1].fareFromSource}`
                                            : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="close-modal-btn" onClick={closeBusDetails}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDashboard;