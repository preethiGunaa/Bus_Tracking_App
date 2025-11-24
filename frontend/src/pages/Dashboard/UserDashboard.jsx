import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import './UserDashboard.css';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('track');
    const [showProfile, setShowProfile] = useState(false);
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyBuses, setNearbyBuses] = useState([]);
    const [searchData, setSearchData] = useState({
        source: '',
        destination: '',
        busType: ''
    });
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedBus, setSelectedBus] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [trackingBus, setTrackingBus] = useState(null);
    const [journeyHistory, setJourneyHistory] = useState([]);
    const [favoriteBuses, setFavoriteBuses] = useState([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Load data from localStorage
    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        const savedHistory = localStorage.getItem('journeyHistory');
        const savedFavorites = localStorage.getItem('favoriteBuses');

        if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
        if (savedHistory) setJourneyHistory(JSON.parse(savedHistory));
        if (savedFavorites) setFavoriteBuses(JSON.parse(savedFavorites));
    }, []);

    // Save search to recent searches
    const saveToRecentSearches = (search) => {
        const newSearch = {
            ...search,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        const updatedSearches = [newSearch, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    // Save to journey history
    const saveToJourneyHistory = (journey) => {
        const newJourney = {
            ...journey,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        const updatedHistory = [newJourney, ...journeyHistory.slice(0, 9)];
        setJourneyHistory(updatedHistory);
        localStorage.setItem('journeyHistory', JSON.stringify(updatedHistory));
    };

    // Toggle favorite bus
    const toggleFavorite = (bus) => {
        const isFavorite = favoriteBuses.some(fav => fav._id === bus._id);
        let updatedFavorites;

        if (isFavorite) {
            updatedFavorites = favoriteBuses.filter(fav => fav._id !== bus._id);
        } else {
            updatedFavorites = [bus, ...favoriteBuses];
        }

        setFavoriteBuses(updatedFavorites);
        localStorage.setItem('favoriteBuses', JSON.stringify(updatedFavorites));
    };

    const handleSearchChange = (e) => {
        setSearchData({
            ...searchData,
            [e.target.name]: e.target.value
        });
    };


    const handleEnableLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    setUserLocation(location);
                    setLocationEnabled(true);

                    // Mock nearby buses for demonstration
                    const mockNearbyBuses = [
                        {
                            _id: '1',
                            busName: 'City Express',
                            busNumber: 'CE-101',
                            busType: 'government',
                            route: { source: 'City Center', destination: 'Tech Park' },
                            distance: '0.8',
                            eta: '5 mins',
                            speed: '35 km/h',
                            nextStop: 'Central Station',
                            govtAgency: 'City Transport',
                            schedule: {
                                firstTrip: '06:00 AM',
                                lastTrip: '10:00 PM',
                                frequency: '15 mins'
                            }
                        },
                        {
                            _id: '2',
                            busName: 'Metro Shuttle',
                            busNumber: 'MS-202',
                            busType: 'private',
                            route: { source: 'Mall Road', destination: 'Airport' },
                            distance: '1.2',
                            eta: '8 mins',
                            speed: '40 km/h',
                            nextStop: 'Mall Road',
                            operatorName: 'Metro Trans',
                            schedule: {
                                firstTrip: '05:30 AM',
                                lastTrip: '11:00 PM',
                                frequency: '20 mins'
                            }
                        }
                    ];

                    setNearbyBuses(mockNearbyBuses);
                    setLoading(false);
                },
                (error) => {
                    console.error('Location error:', error);
                    setError('Failed to access location. Please enable location permissions.');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by this browser.');
        }
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
            // Build query parameters for GET request
            const params = new URLSearchParams({
                source: searchData.source.trim(),
                destination: searchData.destination.trim()
            });

            if (searchData.busType) {
                params.append('busType', searchData.busType);
            }

            console.log('🟡 Sending GET request to API...');
            console.log('🟡 Query params:', params.toString());

            const apiUrl = `http://localhost:5000/api/buses/search?${params}`;
            console.log('🟡 Full API URL:', apiUrl);

            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('🟡 Response status:', response.status);
            console.log('🟡 Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('🔴 Response not OK:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('🟡 Full API response:', result);

            if (result.success) {
                const buses = result.data || [];
                console.log('🟢 Found buses:', buses);

                setSearchResults(buses);
                saveToRecentSearches(searchData);

                if (buses.length === 0) {
                    setError('No buses found for this route. Try different locations or check back later.');
                } else {
                    setError('');
                }
            } else {
                console.error('🔴 API returned error:', result.message);
                setError(result.message || 'Search failed. Please try again.');
                setSearchResults([]);
            }
        } catch (err) {
            console.error('🔴 Network/API error:', err);

            // Fallback to mock data
            const mockBuses = [
                {
                    _id: '1',
                    busName: 'City Express',
                    busNumber: 'CE-101',
                    busType: 'government',
                    route: { source: searchData.source, destination: searchData.destination },
                    govtAgency: 'City Transport',
                    schedule: {
                        firstTrip: '06:00 AM',
                        lastTrip: '10:00 PM',
                        frequency: '15 mins'
                    },
                    stops: [
                        { stopName: searchData.source, stopOrder: 1, distanceFromSource: 0, fareFromSource: 0 },
                        { stopName: 'Central Station', stopOrder: 2, distanceFromSource: 2, fareFromSource: 10 },
                        { stopName: searchData.destination, stopOrder: 3, distanceFromSource: 5, fareFromSource: 25 }
                    ]
                },
                {
                    _id: '2',
                    busName: 'Metro Shuttle',
                    busNumber: 'MS-202',
                    busType: 'private',
                    route: { source: searchData.source, destination: searchData.destination },
                    operatorName: 'Metro Trans',
                    schedule: {
                        firstTrip: '05:30 AM',
                        lastTrip: '11:00 PM',
                        frequency: '20 mins'
                    },
                    stops: [
                        { stopName: searchData.source, stopOrder: 1, distanceFromSource: 0, fareFromSource: 0 },
                        { stopName: 'Mall Road', stopOrder: 2, distanceFromSource: 1.5, fareFromSource: 15 },
                        { stopName: searchData.destination, stopOrder: 3, distanceFromSource: 4.5, fareFromSource: 30 }
                    ]
                }
            ];

            const filteredBuses = searchData.busType
                ? mockBuses.filter(bus => bus.busType === searchData.busType)
                : mockBuses;

            setSearchResults(filteredBuses);
            saveToRecentSearches(searchData);

            if (filteredBuses.length === 0) {
                setError('No buses found for this route. Using demo data.');
            } else {
                setError('Connected to demo data. Backend server might be unavailable.');
            }
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

    const handleTrackBus = (bus) => {
        const trackingBusWithDetails = {
            ...bus,
            speed: bus.speed || '35 km/h',
            nextStop: bus.nextStop || 'Next Stop',
            eta: bus.eta || '10 mins'
        };

        setTrackingBus(trackingBusWithDetails);

        // Save to journey history when starting to track
        saveToJourneyHistory({
            bus: trackingBusWithDetails,
            route: trackingBusWithDetails.route,
            type: 'tracking'
        });
    };

    const handleStopTracking = () => {
        setTrackingBus(null);
    };

    const handleSeeFullDetails = async (bus) => {
        setSelectedBus(bus);
    };

    const closeBusDetails = () => {
        setSelectedBus(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const clearJourneyHistory = () => {
        setJourneyHistory([]);
        localStorage.removeItem('journeyHistory');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="user-dashboard">
            {/* Navbar Component */}
            <Navbar onProfileClick={() => setShowProfile(!showProfile)} />

            {/* Profile Dropdown */}
            {showProfile && (
                <div className="profile-dropdown">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="profile-info">
                            <h3>{user.name || 'User'}</h3>
                            <p>{user.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="detail-item">
                            <span className="label">Contact:</span>
                            <span className="value">{user.contact || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">User ID:</span>
                            <span className="value">{user._id || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="label">Member since:</span>
                            <span className="value">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            )}

            {/* Main Dashboard Content */}
            <main className="dashboard-main">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <div className="welcome-text">
                            <h1>Welcome back, {user.name || 'User'}! 👋</h1>
                            <p>Track your buses in real-time and plan your journey efficiently</p>
                        </div>
                        <div className="welcome-stats">
                            <div className="stat-card">
                                <div className="stat-icon">🚌</div>
                                <div className="stat-info">
                                    <div className="stat-number">{favoriteBuses.length}</div>
                                    <div className="stat-label">Favorite Buses</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📜</div>
                                <div className="stat-info">
                                    <div className="stat-number">{journeyHistory.length}</div>
                                    <div className="stat-label">Journeys</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <nav className="dashboard-nav">
                    <div className="nav-container">
                        <button
                            className={`nav-btn ${activeTab === 'track' ? 'active' : ''}`}
                            onClick={() => setActiveTab('track')}
                        >
                            <span className="nav-icon">🗺️</span>
                            Live Tracking
                        </button>
                        <button
                            className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
                            onClick={() => setActiveTab('search')}
                        >
                            <span className="nav-icon">🔍</span>
                            Search Buses
                        </button>
                        <button
                            className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
                            onClick={() => setActiveTab('history')}
                        >
                            <span className="nav-icon">📜</span>
                            Journey History
                        </button>
                        <button
                            className={`nav-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                            onClick={() => setActiveTab('favorites')}
                        >
                            <span className="nav-icon">⭐</span>
                            Favorites
                        </button>
                    </div>
                </nav>

                {/* Tab Content */}
                <div className="tab-content">
                    {/* Live Tracking Tab */}
                    {activeTab === 'track' && (
                        <div className="tracking-section">
                            {!trackingBus ? (
                                <>
                                    <div className="section-header">
                                        <h2>📍 Real-Time Bus Tracking</h2>
                                        <p>Enable location access to track nearby buses on the interactive map</p>
                                    </div>

                                    <div className="tracking-content">
                                        {/* Map Section */}
                                        <div className="map-section">
                                            <div className="map-container">
                                                <div className="city-map">
                                                    <div className="map-grid">
                                                        <div className="map-road horizontal" style={{ top: '40%' }}></div>
                                                        <div className="map-road vertical" style={{ left: '30%' }}></div>
                                                        <div className="map-road vertical" style={{ left: '60%' }}></div>

                                                        {/* Bus markers */}
                                                        <div className="map-bus-marker" style={{ top: '40%', left: '30%' }}>
                                                            <div className="bus-pin">🚌</div>
                                                            <div className="bus-tooltip">
                                                                <strong>City Express</strong>
                                                                <span>CE-101 • 5 mins away</span>
                                                            </div>
                                                        </div>
                                                        <div className="map-bus-marker" style={{ top: '60%', left: '60%' }}>
                                                            <div className="bus-pin">🚌</div>
                                                            <div className="bus-tooltip">
                                                                <strong>Metro Shuttle</strong>
                                                                <span>MS-202 • 8 mins away</span>
                                                            </div>
                                                        </div>

                                                        {locationEnabled && (
                                                            <div className="user-location-marker">
                                                                <div className="user-pin">📍</div>
                                                                <span className="location-label">You are here</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location Enable Section */}
                                        {!locationEnabled && (
                                            <div className="location-permission-card">
                                                <div className="location-icon">🌍</div>
                                                <div className="location-content">
                                                    <h3>Enable Live Location</h3>
                                                    <p>Allow location access to see buses near you and get accurate arrival times</p>
                                                    <button
                                                        className="btn btn-primary btn-large"
                                                        onClick={handleEnableLocation}
                                                        disabled={loading}
                                                    >
                                                        {loading ? '🔄 Enabling...' : '📍 Enable Live Location'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Nearby Buses */}
                                        {locationEnabled && nearbyBuses.length > 0 && (
                                            <div className="nearby-buses-section">
                                                <h3>🚌 Buses Near You ({nearbyBuses.length})</h3>
                                                <div className="buses-grid">
                                                    {nearbyBuses.map(bus => (
                                                        <div key={bus._id} className="bus-card">
                                                            <div className="bus-header">
                                                                <h4>{bus.busName}</h4>
                                                                <span className={`bus-type ${bus.busType}`}>
                                                                    {bus.busType === 'government' ? '🏛️ Government' : '🏢 Private'}
                                                                </span>
                                                            </div>
                                                            <div className="bus-info">
                                                                <p><strong>Bus No:</strong> {bus.busNumber}</p>
                                                                <p><strong>Route:</strong> {bus.route.source} → {bus.route.destination}</p>
                                                                <p><strong>Distance:</strong> {bus.distance} km away</p>
                                                                <p><strong>ETA:</strong> {bus.eta}</p>
                                                            </div>
                                                            <div className="bus-actions">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={() => handleTrackBus(bus)}
                                                                >
                                                                    🚀 Track Bus
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline"
                                                                    onClick={() => handleSeeFullDetails(bus)}
                                                                >
                                                                    📋 Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Active Tracking View */
                                <div className="active-tracking-view">
                                    <div className="tracking-header">
                                        <button className="btn btn-outline" onClick={handleStopTracking}>
                                            ← Back to Map
                                        </button>
                                        <div className="tracking-title">
                                            <h2>🚌 Tracking: {trackingBus.busName}</h2>
                                            <div className="live-badge">
                                                <span className="pulse-dot"></span>
                                                LIVE
                                            </div>
                                        </div>
                                    </div>

                                    <div className="tracking-details">
                                        <div className="map-view">
                                            <div className="tracking-map">
                                                <div className="route-map">
                                                    <div className="route-visualization">
                                                        <div className="route-path">
                                                            <div className="path-start">📍 {trackingBus.route.source}</div>
                                                            <div className="path-line"></div>
                                                            <div className="path-end">🎯 {trackingBus.route.destination}</div>
                                                        </div>
                                                        <div className="moving-bus-indicator">
                                                            <div className="bus-marker-moving">🚌</div>
                                                            <div className="bus-info-popup">
                                                                <strong>{trackingBus.busName}</strong>
                                                                <span>Next: {trackingBus.nextStop}</span>
                                                                <span>ETA: {trackingBus.eta}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tracking-info-cards">
                                            <div className="info-card">
                                                <h3>📊 Bus Information</h3>
                                                <div className="info-grid">
                                                    <div className="info-item">
                                                        <span className="label">Bus Number:</span>
                                                        <span className="value">{trackingBus.busNumber}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="label">Current Speed:</span>
                                                        <span className="value">{trackingBus.speed}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="label">Next Stop:</span>
                                                        <span className="value">{trackingBus.nextStop}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="label">Estimated Arrival:</span>
                                                        <span className="value highlight">{trackingBus.eta}</span>
                                                    </div>
                                                    <div className="info-item">
                                                        <span className="label">Operator:</span>
                                                        <span className="value">
                                                            {trackingBus.busType === 'government' ? trackingBus.govtAgency : trackingBus.operatorName}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="action-card">
                                                <h3>⚡ Quick Actions</h3>
                                                <div className="action-buttons">
                                                    <button className="btn btn-primary">
                                                        🔔 Set Arrival Alert
                                                    </button>
                                                    <button className="btn btn-outline">
                                                        📍 Share Location
                                                    </button>
                                                    <button className="btn btn-outline">
                                                        💰 Check Fare
                                                    </button>
                                                    <button
                                                        className="btn btn-outline"
                                                        onClick={() => handleSeeFullDetails(trackingBus)}
                                                    >
                                                        📋 Full Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search Buses Tab */}
                    {activeTab === 'search' && (
                        <div className="search-section">
                            <div className="section-header">
                                <h2>🔍 Search Buses</h2>
                                <p>Find buses by route and schedule</p>
                            </div>

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

                                <div className="search-actions">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-large"
                                        disabled={loading}
                                    >
                                        {loading ? '🔄 Searching...' : '🔍 Search Buses'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={clearSearch}
                                    >
                                        🗑️ Clear
                                    </button>
                                </div>
                            </form>

                            {error && (
                                <div className={`message ${error.includes('demo') ? 'info-message' : 'error-message'}`}>
                                    {error}
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className="search-results">
                                    <h3>Available Buses ({searchResults.length})</h3>
                                    <div className="buses-grid">
                                        {searchResults.map(bus => (
                                            <div key={bus._id} className="bus-card">
                                                <div className="bus-header">
                                                    <h4>{bus.busName}</h4>
                                                    <div className="bus-header-right">
                                                        <span className={`bus-type ${bus.busType}`}>
                                                            {bus.busType === 'government' ? '🏛️ Government' : '🏢 Private'}
                                                        </span>
                                                        <button
                                                            className={`favorite-btn ${favoriteBuses.some(fav => fav._id === bus._id) ? 'active' : ''}`}
                                                            onClick={() => toggleFavorite(bus)}
                                                            title={favoriteBuses.some(fav => fav._id === bus._id) ? 'Remove from favorites' : 'Add to favorites'}
                                                        >
                                                            {favoriteBuses.some(fav => fav._id === bus._id) ? '★' : '☆'}
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="bus-info">
                                                    <p><strong>Bus No:</strong> {bus.busNumber}</p>
                                                    <p><strong>Route:</strong> {bus.route.source} → {bus.route.destination}</p>
                                                    <p><strong>Operator:</strong> {bus.busType === 'government' ? bus.govtAgency : bus.operatorName}</p>
                                                    <p><strong>Schedule:</strong> {bus.schedule.firstTrip} - {bus.schedule.lastTrip}</p>
                                                    <p><strong>Frequency:</strong> Every {bus.schedule.frequency}</p>
                                                </div>
                                                <div className="bus-actions">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleTrackBus(bus)}
                                                    >
                                                        🚀 Track Bus
                                                    </button>
                                                    <button
                                                        className="btn btn-outline"
                                                        onClick={() => handleSeeFullDetails(bus)}
                                                    >
                                                        📋 View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {searchResults.length === 0 && !loading && !error && (
                                <div className="no-results">
                                    <div className="no-results-icon">🚌</div>
                                    <h3>Search for Buses</h3>
                                    <p>Enter source and destination to find available buses</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="history-section">
                            <div className="section-header">
                                <h2>📜 Journey History</h2>
                                <p>Your recent bus searches and journeys</p>
                            </div>

                            {journeyHistory.length > 0 ? (
                                <>
                                    <div className="history-actions">
                                        <button
                                            className="btn btn-outline"
                                            onClick={clearJourneyHistory}
                                        >
                                            🗑️ Clear All History
                                        </button>
                                    </div>
                                    <div className="journey-list">
                                        {journeyHistory.map((journey) => (
                                            <div key={journey.id} className="journey-item">
                                                {journey.type === 'search' ? (
                                                    // Search History Item
                                                    <>
                                                        <div className="journey-icon">🔍</div>
                                                        <div className="journey-info">
                                                            <div className="journey-route">
                                                                <span className="from">📍 {journey.source || journey.searchData?.source || 'Unknown'}</span>
                                                                <span className="arrow">→</span>
                                                                <span className="to">🎯 {journey.destination || journey.searchData?.destination || 'Unknown'}</span>
                                                            </div>
                                                            <div className="journey-meta">
                                                                <span className="time">
                                                                    {formatDate(journey.timestamp)} • {formatTime(journey.timestamp)}
                                                                </span>
                                                                <span className="type-badge search-badge">Search</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                setSearchData({
                                                                    source: journey.source || journey.searchData?.source || '',
                                                                    destination: journey.destination || journey.searchData?.destination || '',
                                                                    busType: journey.busType || journey.searchData?.busType || ''
                                                                });
                                                                setActiveTab('search');
                                                            }}
                                                        >
                                                            🔍 Search Again
                                                        </button>
                                                    </>
                                                ) : (
                                                    // Tracking History Item
                                                    <>
                                                        <div className="journey-icon">🚌</div>
                                                        <div className="journey-info">
                                                            <div className="journey-route">
                                                                <span className="from">📍 {journey.route?.source || 'Unknown'}</span>
                                                                <span className="arrow">→</span>
                                                                <span className="to">🎯 {journey.route?.destination || 'Unknown'}</span>
                                                            </div>
                                                            <div className="journey-details">
                                                                <span className="bus-name">{journey.bus?.busName || 'Unknown Bus'} ({journey.bus?.busNumber || 'N/A'})</span>
                                                                <span className="bus-type">{journey.bus?.busType === 'government' ? '🏛️ Government' : '🏢 Private'}</span>
                                                            </div>
                                                            <div className="journey-meta">
                                                                <span className="time">
                                                                    {formatDate(journey.timestamp)} • {formatTime(journey.timestamp)}
                                                                </span>
                                                                <span className="type-badge track-badge">Tracked</span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => {
                                                                if (journey.bus) {
                                                                    handleTrackBus(journey.bus);
                                                                    setActiveTab('track');
                                                                }
                                                            }}
                                                        >
                                                            🚀 Track Again
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="no-history">
                                    <div className="no-history-icon">📜</div>
                                    <h3>No Journey History</h3>
                                    <p>Your bus searches and tracked journeys will appear here</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setActiveTab('search')}
                                    >
                                        🔍 Start Searching
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <div className="favorites-section">
                            <div className="section-header">
                                <h2>⭐ Favorite Buses</h2>
                                <p>Your frequently used buses for quick access</p>
                            </div>

                            {favoriteBuses.length > 0 ? (
                                <div className="favorites-grid">
                                    {favoriteBuses.map(bus => (
                                        <div key={bus._id} className="bus-card favorite">
                                            <div className="bus-header">
                                                <h4>{bus.busName}</h4>
                                                <div className="bus-header-right">
                                                    <span className={`bus-type ${bus.busType}`}>
                                                        {bus.busType === 'government' ? '🏛️ Government' : '🏢 Private'}
                                                    </span>
                                                    <button
                                                        className="favorite-btn active"
                                                        onClick={() => toggleFavorite(bus)}
                                                        title="Remove from favorites"
                                                    >
                                                        ★
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bus-info">
                                                <p><strong>Bus No:</strong> {bus.busNumber}</p>
                                                <p><strong>Route:</strong> {bus.route.source} → {bus.route.destination}</p>
                                                <p><strong>Operator:</strong> {bus.busType === 'government' ? bus.govtAgency : bus.operatorName}</p>
                                            </div>
                                            <div className="bus-actions">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleTrackBus(bus)}
                                                >
                                                    🚀 Track Bus
                                                </button>
                                                <button
                                                    className="btn btn-outline"
                                                    onClick={() => handleSeeFullDetails(bus)}
                                                >
                                                    📋 View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-favorites">
                                    <div className="no-favorites-icon">⭐</div>
                                    <h3>No Favorite Buses Yet</h3>
                                    <p>Start tracking buses and add them to your favorites for quick access</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setActiveTab('search')}
                                    >
                                        🔍 Search Buses
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Bus Details Modal */}
            {selectedBus && (
                <div className="modal-overlay" onClick={closeBusDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🚌 {selectedBus.busName} - Complete Details</h2>
                            <button className="close-btn" onClick={closeBusDetails}>✕</button>
                        </div>

                        <div className="modal-body">
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

                            {selectedBus.stops && selectedBus.stops.length > 0 && (
                                <>
                                    <div className="stops-section">
                                        <h3>🛑 Bus Stops & Fare Details</h3>
                                        <div className="stops-list">
                                            {selectedBus.stops.map((stop, index) => (
                                                <div key={index} className="stop-item">
                                                    <div className="stop-marker">
                                                        <div className="stop-dot"></div>
                                                        {index < selectedBus.stops.length - 1 && <div className="stop-connector"></div>}
                                                    </div>
                                                    <div className="stop-content">
                                                        <div className="stop-header">
                                                            <span className="stop-name">{stop.stopName}</span>
                                                            {stop.fareFromSource > 0 && (
                                                                <span className="stop-fare">₹{stop.fareFromSource}</span>
                                                            )}
                                                        </div>
                                                        <div className="stop-details">
                                                            <span className="stop-order">Stop #{stop.stopOrder}</span>
                                                            {stop.distanceFromSource > 0 && (
                                                                <span className="stop-distance">{stop.distanceFromSource} km</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="route-summary">
                                        <h3>📊 Route Summary</h3>
                                        <div className="summary-grid">
                                            <div className="summary-item">
                                                <strong>Total Stops:</strong> {selectedBus.stops.length}
                                            </div>
                                            <div className="summary-item">
                                                <strong>Total Distance:</strong> {selectedBus.stops.length > 0
                                                    ? `${selectedBus.stops[selectedBus.stops.length - 1].distanceFromSource} km`
                                                    : 'N/A'}
                                            </div>
                                            <div className="summary-item">
                                                <strong>Total Fare:</strong> {selectedBus.stops.length > 0
                                                    ? `₹${selectedBus.stops[selectedBus.stops.length - 1].fareFromSource}`
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={() => handleTrackBus(selectedBus)}>
                                🚀 Track This Bus
                            </button>
                            <button className="btn btn-outline" onClick={closeBusDetails}>
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



