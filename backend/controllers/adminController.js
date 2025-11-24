const User = require('../models/User');
const Bus = require('../models/Bus');
const Report = require('../models/Report');

// 🟢 GET ADMIN DASHBOARD STATS
const getDashboardStats = async (req, res) => {
    try {
        console.log('🟡 Fetching admin dashboard stats...');

        // Get total counts
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDrivers = await User.countDocuments({ role: 'driver' });
        const totalBuses = await Bus.countDocuments();
        const totalReports = await Report.countDocuments();

        // Get active buses count
        const activeBuses = await Bus.countDocuments({
            'currentStatus.availableToday': true,
            'currentStatus.isActive': true
        });

        // Get recent reports
        const recentReports = await Report.find()
            .populate('bus', 'busNumber busName')
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        console.log('🟡 Dashboard stats fetched successfully');

        res.json({
            success: true,
            data: {
                totals: {
                    users: totalUsers,
                    drivers: totalDrivers,
                    buses: totalBuses,
                    reports: totalReports,
                    activeBuses: activeBuses
                },
                recentReports
            },
            message: 'Dashboard stats fetched successfully'
        });

    } catch (error) {
        console.error('🔴 Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching dashboard stats'
        });
    }
};

// 🟢 GET ALL REPORTS WITH FILTERS
const getAllReports = async (req, res) => {
    try {
        const {
            reportType,
            startDate,
            endDate,
            page = 1,
            limit = 10
        } = req.query;

        console.log('🟡 Fetching all reports with filters:', { reportType, startDate, endDate });

        let query = {};

        // Filter by report type
        if (reportType && reportType !== 'all') {
            query.reportType = reportType;
        }

        // Filter by date range
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const reports = await Report.find(query)
            .populate('bus', 'busNumber busName busType')
            .populate('generatedBy', 'name email role')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Report.countDocuments(query);

        console.log('🟡 Reports fetched successfully:', reports.length);

        res.json({
            success: true,
            data: reports,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                results: total
            },
            message: 'Reports fetched successfully'
        });

    } catch (error) {
        console.error('🔴 Get all reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching reports'
        });
    }
};

// 🟢 GET ALL BUSES
const getAllBuses = async (req, res) => {
    try {
        const { page = 1, limit = 10, busType } = req.query;

        console.log('🟡 Fetching all buses...');

        let query = {};
        if (busType && busType !== 'all') {
            query.busType = busType;
        }

        const buses = await Bus.find(query)
            .populate('driver', 'name email phone')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Bus.countDocuments(query);

        console.log('🟡 Buses fetched successfully:', buses.length);

        res.json({
            success: true,
            data: buses,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                results: total
            },
            message: 'Buses fetched successfully'
        });

    } catch (error) {
        console.error('🔴 Get all buses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching buses'
        });
    }
};

// 🟢 GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role } = req.query;

        console.log('🟡 Fetching all users...');

        let query = {};
        if (role && role !== 'all') {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        console.log('🟡 Users fetched successfully:', users.length);

        res.json({
            success: true,
            data: users,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                results: total
            },
            message: 'Users fetched successfully'
        });

    } catch (error) {
        console.error('🔴 Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching users'
        });
    }
};

// 🟢 GENERATE SYSTEM REPORT
const generateSystemReport = async (req, res) => {
    try {
        const { startDate, endDate, reportType } = req.body;

        console.log('🟡 Generating system report...');

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Get data for the period
        const periodUsers = await User.countDocuments({
            createdAt: { $gte: start, $lte: end }
        });

        const periodBuses = await Bus.countDocuments({
            createdAt: { $gte: start, $lte: end }
        });

        const periodReports = await Report.countDocuments({
            createdAt: { $gte: start, $lte: end }
        });

        const systemReport = await Report.create({
            title: `System Analysis Report - ${start.toDateString()} to ${end.toDateString()}`,
            description: `Comprehensive system analysis and performance report`,
            reportType: 'financial',
            generatedBy: req.user.id,
            data: {
                period: {
                    startDate: start,
                    endDate: end
                },
                summary: {
                    newUsers: periodUsers,
                    newBuses: periodBuses,
                    reportsGenerated: periodReports,
                    totalRevenue: 0, // You can implement actual revenue tracking
                    averageRevenue: 0
                }
            },
            status: 'published'
        });

        const populatedReport = await Report.findById(systemReport._id)
            .populate('generatedBy', 'name email');

        console.log('🟡 System report generated successfully');

        res.status(201).json({
            success: true,
            data: populatedReport,
            message: 'System report generated successfully'
        });

    } catch (error) {
        console.error('🔴 System report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error generating system report'
        });
    }
};

// 🟢 DELETE USER (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log('🟡 Deleting user:', userId);

        // Prevent admin from deleting themselves
        if (userId === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('🟡 User deleted successfully');

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        console.error('🔴 Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting user'
        });
    }
};

// 🟢 DELETE BUS (Admin only)
const deleteBus = async (req, res) => {
    try {
        const { busId } = req.params;

        console.log('🟡 Deleting bus:', busId);

        const bus = await Bus.findByIdAndDelete(busId);

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        console.log('🟡 Bus deleted successfully');

        res.json({
            success: true,
            message: 'Bus deleted successfully'
        });

    } catch (error) {
        console.error('🔴 Delete bus error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting bus'
        });
    }
};

module.exports = {
    getDashboardStats,
    getAllReports,
    getAllBuses,
    getAllUsers,
    generateSystemReport,
    deleteUser,
    deleteBus
};