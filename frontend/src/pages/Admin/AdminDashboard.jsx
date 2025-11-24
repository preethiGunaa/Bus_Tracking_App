import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState([]);
    const [buses, setBuses] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReportType, setSelectedReportType] = useState('all');
    const navigate = useNavigate();

    // Auto-dismiss messages
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    useEffect(() => {
        checkAuth();
    }, [navigate]);

    const checkAuth = () => {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const token = localStorage.getItem('token');

        if (!token || userData.role !== 'admin') {
            navigate('/');
            return;
        }

        setUser(userData);
        fetchDashboardStats();
    };

    // Enhanced API calls
    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                setStats(result.data);
            } else {
                setError(result.message || 'Failed to fetch dashboard stats');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllReports = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/admin/reports', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.success) setReports(result.data);
            else setError(result.message || 'Failed to fetch reports');
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllBuses = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/admin/buses', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.success) setBuses(result.data);
            else setError(result.message || 'Failed to fetch buses');
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.success) setUsers(result.data);
            else setError(result.message || 'Failed to fetch users');
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchTerm('');
        setSelectedReportType('all');
        if (tab === 'reports') fetchAllReports();
        else if (tab === 'users') fetchAllUsers();
        else if (tab === 'buses') fetchAllBuses();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    // Enhanced Functions
    const generateSystemReport = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/reports/system', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0],
                    reportType: 'comprehensive',
                    includeUsers: true,
                    includeBuses: true,
                    includeDrivers: true,
                    includeFinancials: true
                })
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('✅ Comprehensive system report generated successfully!');
                fetchDashboardStats();
                fetchAllReports();

                // Auto-download the generated report
                if (result.data && result.data._id) {
                    setTimeout(() => {
                        downloadReportPDF(result.data._id, 'System_Report_' + new Date().toISOString().split('T')[0]);
                    }, 1000);
                }
            } else {
                setError('❌ ' + (result.message || 'Failed to generate system report'));
            }
        } catch (err) {
            setError('❌ Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadReportPDF = async (reportId, reportTitle) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/reports/${reportId}/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `${reportTitle.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                setSuccess('✅ Report downloaded successfully!');
            } else {
                // Fallback: Create a simple PDF download
                createFallbackPDF(reportTitle);
            }
        } catch (err) {
            // Fallback: Create a simple PDF download
            createFallbackPDF(reportTitle);
        }
    };

    // Fallback PDF generation
    const createFallbackPDF = (reportTitle) => {
        const content = `
            System Report: ${reportTitle}
            Generated on: ${new Date().toLocaleDateString()}
            
            This is a fallback PDF content.
            The actual PDF generation would contain:
            - User statistics and details
            - Bus fleet overview
            - Driver information
            - Financial summaries
            - Performance metrics
        `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${reportTitle.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setSuccess('✅ Fallback report downloaded!');
    };

    const deleteReport = async (reportId, reportTitle) => {
        if (!window.confirm(`Are you sure you want to delete report "${reportTitle}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/reports/${reportId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('✅ Report deleted successfully!');
                fetchAllReports();
                fetchDashboardStats();
            } else {
                setError('❌ ' + (result.message || 'Failed to delete report'));
            }
        } catch (err) {
            setError('❌ Network error. Please try again.');
        }
    };

    const deleteUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('✅ User deleted successfully!');
                fetchAllUsers();
                fetchDashboardStats();
            } else {
                setError('❌ ' + (result.message || 'Failed to delete user'));
            }
        } catch (err) {
            setError('❌ Network error. Please try again.');
        }
    };

    const deleteBus = async (busId, busName) => {
        if (!window.confirm(`Are you sure you want to delete bus "${busName}"?`)) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/buses/${busId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            if (result.success) {
                setSuccess('✅ Bus deleted successfully!');
                fetchAllBuses();
                fetchDashboardStats();
            } else {
                setError('❌ ' + (result.message || 'Failed to delete bus'));
            }
        } catch (err) {
            setError('❌ Network error. Please try again.');
        }
    };

    const toggleBusStatus = async (busId, currentStatus, busName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/buses/${busId}/status`, {
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
                setSuccess(`✅ Bus "${busName}" ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
                fetchAllBuses();
                fetchDashboardStats();
            } else {
                setError('❌ ' + (result.message || 'Failed to update bus status'));
            }
        } catch (err) {
            setError('❌ Network error. Please try again.');
        }
    };

    // Filter functions
    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.bus?.busName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reportType?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedReportType === 'all' || report.reportType === selectedReportType;
        return matchesSearch && matchesType;
    });

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredBuses = buses.filter(bus =>
        bus.busName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.busNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.route?.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.route?.destination?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getReportIcon = (type) => {
        const icons = {
            daily: '📅',
            performance: '📈',
            incident: '⚠️',
            maintenance: '🔧',
            financial: '💰',
            comprehensive: '📊',
            system: '🖥️'
        };
        return icons[type] || '📄';
    };

    const getStatusBadge = (status) => {
        return status ? 'active' : 'inactive';
    };

    if (!user) {
        return (
            <div className="admin-dashboard">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading Admin Dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="container">
                    <div className="header-content">
                        <div className="header-left">
                            <div className="logo-section">
                                <h1 className="logo">👑 BusTrack Pro</h1>
                                <span className="admin-badge">Admin Panel</span>
                            </div>
                            <nav className="admin-nav">
                                <button
                                    className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('dashboard')}
                                >
                                    <span className="nav-icon">📊</span>
                                    <span className="nav-text">Dashboard</span>
                                </button>
                                <button
                                    className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('reports')}
                                >
                                    <span className="nav-icon">📋</span>
                                    <span className="nav-text">Reports</span>
                                    {stats?.totals?.reports > 0 && (
                                        <span className="nav-badge">{stats.totals.reports}</span>
                                    )}
                                </button>
                                <button
                                    className={`nav-btn ${activeTab === 'users' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('users')}
                                >
                                    <span className="nav-icon">👥</span>
                                    <span className="nav-text">Users</span>
                                    {stats?.totals?.users > 0 && (
                                        <span className="nav-badge">{stats.totals.users}</span>
                                    )}
                                </button>
                                <button
                                    className={`nav-btn ${activeTab === 'buses' ? 'active' : ''}`}
                                    onClick={() => handleTabChange('buses')}
                                >
                                    <span className="nav-icon">🚌</span>
                                    <span className="nav-text">Buses</span>
                                    {stats?.totals?.buses > 0 && (
                                        <span className="nav-badge">{stats.totals.buses}</span>
                                    )}
                                </button>
                            </nav>
                        </div>
                        <div className="header-right">
                            <div className="user-welcome">
                                <span className="welcome-text">Welcome back,</span>
                                <span className="user-name">{user.name}</span>
                            </div>
                            <button className="btn btn-outline" onClick={handleLogout}>
                                <span className="btn-icon">🚪</span>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="admin-main">
                <div className="container">
                    {/* Alerts with auto-dismiss */}
                    {error && (
                        <div className="alert alert-error">
                            <span className="alert-icon">❌</span>
                            {error}
                            <button className="alert-close" onClick={() => setError('')}>×</button>
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success">
                            <span className="alert-icon">✅</span>
                            {success}
                            <button className="alert-close" onClick={() => setSuccess('')}>×</button>
                        </div>
                    )}

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="dashboard-tab">
                            <div className="section-header">
                                <div className="header-main">
                                    <h2>System Overview</h2>
                                    <p>Complete overview of your bus tracking system</p>
                                </div>
                                <div className="header-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={generateSystemReport}
                                        disabled={loading}
                                    >
                                        <span className="btn-icon">📈</span>
                                        {loading ? 'Generating...' : 'Generate System Report'}
                                    </button>
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading dashboard data...</p>
                                </div>
                            ) : stats ? (
                                <div className="dashboard-content">
                                    <div className="stats-grid">
                                        <div className="stat-card primary">
                                            <div className="stat-icon">👥</div>
                                            <div className="stat-content">
                                                <h3>{stats.totals?.users || 0}</h3>
                                                <p>Total Users</p>
                                                <span className="stat-trend">
                                                    {stats.userStats?.drivers || 0} drivers, {stats.userStats?.regularUsers || 0} users
                                                </span>
                                            </div>
                                        </div>
                                        <div className="stat-card secondary">
                                            <div className="stat-icon">🚗</div>
                                            <div className="stat-content">
                                                <h3>{stats.totals?.drivers || 0}</h3>
                                                <p>Active Drivers</p>
                                                <span className="stat-trend">
                                                    {stats.driverStats?.active || 0} active now
                                                </span>
                                            </div>
                                        </div>
                                        <div className="stat-card primary">
                                            <div className="stat-icon">🚌</div>
                                            <div className="stat-content">
                                                <h3>{stats.totals?.buses || 0}</h3>
                                                <p>Total Buses</p>
                                                <span className="stat-trend">
                                                    {stats.busStats?.private || 0} private, {stats.busStats?.government || 0} govt
                                                </span>
                                            </div>
                                        </div>
                                        <div className="stat-card secondary">
                                            <div className="stat-icon">📊</div>
                                            <div className="stat-content">
                                                <h3>{stats.totals?.reports || 0}</h3>
                                                <p>Total Reports</p>
                                                <span className="stat-trend">
                                                    {stats.reportStats?.incidents || 0} incidents this week
                                                </span>
                                            </div>
                                        </div>
                                        <div className="stat-card highlight">
                                            <div className="stat-icon">🟢</div>
                                            <div className="stat-content">
                                                <h3>{stats.totals?.activeBuses || 0}</h3>
                                                <p>Active Buses Today</p>
                                                <span className="stat-trend">Real-time tracking</span>
                                            </div>
                                        </div>
                                        <div className="stat-card warning">
                                            <div className="stat-icon">💰</div>
                                            <div className="stat-content">
                                                <h3>₹{stats.financialStats?.totalRevenue || 0}</h3>
                                                <p>Total Revenue</p>
                                                <span className="stat-trend">This month</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="quick-actions">
                                        <h3>Quick Actions</h3>
                                        <div className="actions-grid">
                                            <button className="action-btn" onClick={() => handleTabChange('reports')}>
                                                <span className="action-icon">📋</span>
                                                <span className="action-text">View All Reports</span>
                                            </button>
                                            <button className="action-btn" onClick={() => handleTabChange('users')}>
                                                <span className="action-icon">👥</span>
                                                <span className="action-text">Manage Users</span>
                                            </button>
                                            <button className="action-btn" onClick={() => handleTabChange('buses')}>
                                                <span className="action-icon">🚌</span>
                                                <span className="action-text">Manage Buses</span>
                                            </button>
                                            <button className="action-btn" onClick={generateSystemReport}>
                                                <span className="action-icon">📈</span>
                                                <span className="action-text">Generate Report</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    {stats.recentReports && stats.recentReports.length > 0 && (
                                        <div className="recent-activity">
                                            <h3>Recent Reports</h3>
                                            <div className="activity-list">
                                                {stats.recentReports.slice(0, 5).map((report, index) => (
                                                    <div key={index} className="activity-item">
                                                        <span className="activity-icon">
                                                            {getReportIcon(report.reportType)}
                                                        </span>
                                                        <div className="activity-content">
                                                            <span className="activity-title">{report.title}</span>
                                                            <span className="activity-meta">
                                                                {report.bus?.busName} • {new Date(report.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="no-data">
                                    <div className="no-data-icon">📊</div>
                                    <h3>No Dashboard Data</h3>
                                    <p>Unable to load system statistics</p>
                                    <button className="btn btn-primary" onClick={fetchDashboardStats}>
                                        Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reports Tab */}
                    {activeTab === 'reports' && (
                        <div className="reports-tab">
                            <div className="section-header">
                                <div className="header-main">
                                    <h2>System Reports</h2>
                                    <p>All reports generated by drivers and the system</p>
                                </div>
                                <div className="header-actions">
                                    <button
                                        className="btn btn-primary"
                                        onClick={generateSystemReport}
                                        disabled={loading}
                                    >
                                        <span className="btn-icon">📈</span>
                                        Generate New Report
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="filters-section">
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search reports..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                <select
                                    value={selectedReportType}
                                    onChange={(e) => setSelectedReportType(e.target.value)}
                                    className="filter-select"
                                >
                                    <option value="all">All Report Types</option>
                                    <option value="daily">Daily Reports</option>
                                    <option value="performance">Performance Reports</option>
                                    <option value="incident">Incident Reports</option>
                                    <option value="financial">Financial Reports</option>
                                    <option value="maintenance">Maintenance Reports</option>
                                    <option value="comprehensive">Comprehensive Reports</option>
                                    <option value="system">System Reports</option>
                                </select>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading reports...</p>
                                </div>
                            ) : filteredReports.length > 0 ? (
                                <div className="reports-grid">
                                    {filteredReports.map((report, index) => (
                                        <div key={index} className="report-card">
                                            <div className="report-header">
                                                <div className="report-title-section">
                                                    <span className="report-icon">
                                                        {getReportIcon(report.reportType)}
                                                    </span>
                                                    <div>
                                                        <h4>{report.title}</h4>
                                                        <span className="report-date">
                                                            {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="report-actions">
                                                    <button
                                                        className="btn-icon download-btn"
                                                        onClick={() => downloadReportPDF(report._id, report.title)}
                                                        title="Download PDF"
                                                    >
                                                        📥
                                                    </button>
                                                    <button
                                                        className="btn-icon delete-btn"
                                                        onClick={() => deleteReport(report._id, report.title)}
                                                        title="Delete Report"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="report-content">
                                                <div className="report-meta">
                                                    <div className="meta-item">
                                                        <span className="meta-label">Bus:</span>
                                                        <span className="meta-value">{report.bus?.busName} ({report.bus?.busNumber})</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-label">Generated By:</span>
                                                        <span className="meta-value">{report.generatedBy?.name || 'System'}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-label">Type:</span>
                                                        <span className="meta-value report-type-badge">{report.reportType}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-label">Severity:</span>
                                                        <span className={`meta-value severity-${report.severity || 'low'}`}>
                                                            {report.severity || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                                {report.description && (
                                                    <div className="report-description">
                                                        <p>{report.description}</p>
                                                    </div>
                                                )}
                                                {report.data && (
                                                    <div className="report-metrics">
                                                        {report.data.totalTrips !== undefined && (
                                                            <div className="metric">
                                                                <span className="metric-value">{report.data.totalTrips}</span>
                                                                <span className="metric-label">Trips</span>
                                                            </div>
                                                        )}
                                                        {report.data.totalRevenue !== undefined && (
                                                            <div className="metric">
                                                                <span className="metric-value">₹{report.data.totalRevenue}</span>
                                                                <span className="metric-label">Revenue</span>
                                                            </div>
                                                        )}
                                                        {report.data.totalPassengers !== undefined && (
                                                            <div className="metric">
                                                                <span className="metric-value">{report.data.totalPassengers}</span>
                                                                <span className="metric-label">Passengers</span>
                                                            </div>
                                                        )}
                                                        {report.data.incidents !== undefined && (
                                                            <div className="metric">
                                                                <span className="metric-value">{report.data.incidents}</span>
                                                                <span className="metric-label">Incidents</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data">
                                    <div className="no-data-icon">📋</div>
                                    <h3>No Reports Found</h3>
                                    <p>{searchTerm || selectedReportType !== 'all' ? 'Try adjusting your search filters' : 'No reports have been generated yet'}</p>
                                    <button className="btn btn-primary" onClick={generateSystemReport}>
                                        Generate First Report
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="users-tab">
                            <div className="section-header">
                                <div className="header-main">
                                    <h2>System Users</h2>
                                    <p>Manage all users in the system</p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="filters-section">
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading users...</p>
                                </div>
                            ) : filteredUsers.length > 0 ? (
                                <div className="users-grid">
                                    {filteredUsers.map((user, index) => (
                                        <div key={index} className="user-card">
                                            <div className="user-header">
                                                <div className="user-info">
                                                    <div className="user-avatar">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="user-details">
                                                        <h4>{user.name}</h4>
                                                        <span className="user-email">{user.email}</span>
                                                    </div>
                                                </div>
                                                <div className="user-actions">
                                                    <span className={`user-role ${user.role}`}>
                                                        {user.role}
                                                    </span>
                                                    {user.role !== 'admin' && (
                                                        <button
                                                            className="btn-icon delete-btn"
                                                            onClick={() => deleteUser(user._id, user.name)}
                                                            title="Delete User"
                                                        >
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="user-content">
                                                <div className="user-meta">
                                                    <div className="meta-item">
                                                        <span className="meta-label">Phone:</span>
                                                        <span className="meta-value">{user.phone || 'Not provided'}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-label">Joined:</span>
                                                        <span className="meta-value">{new Date(user.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <span className="meta-label">Status:</span>
                                                        <span className={`status-badge ${user.isActive !== false ? 'active' : 'inactive'}`}>
                                                            {user.isActive !== false ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data">
                                    <div className="no-data-icon">👥</div>
                                    <h3>No Users Found</h3>
                                    <p>{searchTerm ? 'No users match your search criteria' : 'No users registered in the system'}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Buses Tab */}
                    {activeTab === 'buses' && (
                        <div className="buses-tab">
                            <div className="section-header">
                                <div className="header-main">
                                    <h2>Registered Buses</h2>
                                    <p>All buses registered in the system</p>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="filters-section">
                                <div className="search-box">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Search buses..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>

                            {loading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Loading buses...</p>
                                </div>
                            ) : filteredBuses.length > 0 ? (
                                <div className="buses-grid">
                                    {filteredBuses.map((bus, index) => (
                                        <div key={index} className="bus-card">
                                            <div className="bus-header">
                                                <div className="bus-info">
                                                    <h4>{bus.busName}</h4>
                                                    <div className="bus-meta">
                                                        <span className="bus-number">{bus.busNumber}</span>
                                                        <span className={`bus-type ${bus.busType}`}>
                                                            {bus.busType}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="bus-actions">
                                                    <button
                                                        className={`status-toggle ${getStatusBadge(bus.currentStatus?.availableToday)}`}
                                                        onClick={() => toggleBusStatus(bus._id, bus.currentStatus?.availableToday, bus.busName)}
                                                    >
                                                        <span className="status-dot"></span>
                                                        {bus.currentStatus?.availableToday ? 'Active' : 'Inactive'}
                                                    </button>
                                                    <button
                                                        className="btn-icon delete-btn"
                                                        onClick={() => deleteBus(bus._id, bus.busName)}
                                                        title="Delete Bus"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="bus-content">
                                                <div className="bus-details">
                                                    <div className="detail-item">
                                                        <span className="detail-icon">👤</span>
                                                        <div className="detail-content">
                                                            <span className="detail-label">Driver</span>
                                                            <span className="detail-value">{bus.driver?.name || 'Not assigned'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-icon">📍</span>
                                                        <div className="detail-content">
                                                            <span className="detail-label">Route</span>
                                                            <span className="detail-value">{bus.route?.source} → {bus.route?.destination}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-icon">⏰</span>
                                                        <div className="detail-content">
                                                            <span className="detail-label">Schedule</span>
                                                            <span className="detail-value">{bus.schedule?.firstTrip} - {bus.schedule?.lastTrip}</span>
                                                        </div>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="detail-icon">💰</span>
                                                        <div className="detail-content">
                                                            <span className="detail-label">Fare</span>
                                                            <span className="detail-value">₹{bus.route?.totalFare || 'N/A'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-data">
                                    <div className="no-data-icon">🚌</div>
                                    <h3>No Buses Found</h3>
                                    <p>{searchTerm ? 'No buses match your search criteria' : 'No buses registered in the system'}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;