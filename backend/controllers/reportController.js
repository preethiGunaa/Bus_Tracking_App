const Report = require('../models/Report');
const Bus = require('../models/Bus');

// 🟢 GENERATE DAILY REPORT
const generateDailyReport = async (req, res) => {
    try {
        const { busId, date } = req.body;
        const driverId = req.user.id;

        // Validate bus ownership
        const bus = await Bus.findOne({ _id: busId, driver: driverId });
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found or not authorized'
            });
        }

        const reportDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(reportDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(reportDate.setHours(23, 59, 59, 999));

        // In a real app, you'd fetch actual data from trips/transactions
        const mockData = {
            totalTrips: Math.floor(Math.random() * 10) + 5,
            totalRevenue: Math.floor(Math.random() * 5000) + 1000,
            totalDistance: Math.floor(Math.random() * 300) + 100,
            totalPassengers: Math.floor(Math.random() * 200) + 50,
            performanceMetrics: {
                onTimeRate: Math.floor(Math.random() * 30) + 70, // 70-100%
                occupancyRate: Math.floor(Math.random() * 40) + 60, // 60-100%
                customerSatisfaction: Math.floor(Math.random() * 2) + 3 // 3-5
            }
        };

        const report = await Report.create({
            title: `Daily Report - ${bus.busName} - ${startOfDay.toDateString()}`,
            description: `Daily performance report for ${bus.busName}`,
            reportType: 'daily',
            generatedBy: driverId,
            bus: busId,
            period: {
                startDate: startOfDay,
                endDate: endOfDay
            },
            data: mockData,
            status: 'published'
        });

        const populatedReport = await Report.findById(report._id)
            .populate('bus', 'busNumber busName')
            .populate('generatedBy', 'name email');

        res.status(201).json({
            success: true,
            data: populatedReport,
            message: 'Daily report generated successfully'
        });

    } catch (error) {
        console.error('🔴 Report generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during report generation'
        });
    }
};

// 🟢 GENERATE PERFORMANCE REPORT
const generatePerformanceReport = async (req, res) => {
    try {
        const { busId, startDate, endDate } = req.body;
        const driverId = req.user.id;

        const bus = await Bus.findOne({ _id: busId, driver: driverId });
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found or not authorized'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        // Mock performance data (replace with actual analytics)
        const performanceData = {
            totalTrips: Math.floor(Math.random() * 50) + 20,
            totalRevenue: Math.floor(Math.random() * 50000) + 15000,
            totalDistance: Math.floor(Math.random() * 2000) + 500,
            totalPassengers: Math.floor(Math.random() * 1000) + 300,
            maintenanceCost: Math.floor(Math.random() * 5000) + 1000,
            fuelCost: Math.floor(Math.random() * 15000) + 5000,
            performanceMetrics: {
                onTimeRate: Math.floor(Math.random() * 25) + 75,
                occupancyRate: Math.floor(Math.random() * 35) + 65,
                customerSatisfaction: Math.floor(Math.random() * 1.5) + 3.5
            }
        };

        const report = await Report.create({
            title: `Performance Report - ${bus.busName} - ${start.toDateString()} to ${end.toDateString()}`,
            description: `Performance analysis report for ${bus.busName}`,
            reportType: 'performance',
            generatedBy: driverId,
            bus: busId,
            period: { startDate: start, endDate: end },
            data: performanceData,
            status: 'published'
        });

        const populatedReport = await Report.findById(report._id)
            .populate('bus', 'busNumber busName busType')
            .populate('generatedBy', 'name email');

        res.status(201).json({
            success: true,
            data: populatedReport,
            message: 'Performance report generated successfully'
        });

    } catch (error) {
        console.error('🔴 Performance report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error generating performance report'
        });
    }
};

// 🟢 REPORT INCIDENT
const reportIncident = async (req, res) => {
    try {
        const { busId, incidentType, description, severity } = req.body;
        const driverId = req.user.id;

        const bus = await Bus.findOne({ _id: busId, driver: driverId });
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found or not authorized'
            });
        }

        const report = await Report.create({
            title: `Incident Report - ${bus.busName} - ${new Date().toLocaleDateString()}`,
            description: description,
            reportType: 'incident',
            generatedBy: driverId,
            bus: busId,
            data: {
                incidents: [{
                    type: incidentType,
                    description: description,
                    date: new Date(),
                    severity: severity || 'medium'
                }]
            },
            status: 'published'
        });

        const populatedReport = await Report.findById(report._id)
            .populate('bus', 'busNumber busName')
            .populate('generatedBy', 'name email');

        res.status(201).json({
            success: true,
            data: populatedReport,
            message: 'Incident reported successfully'
        });

    } catch (error) {
        console.error('🔴 Incident report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error reporting incident'
        });
    }
};

// 🟢 GET ALL REPORTS FOR A DRIVER
const getMyReports = async (req, res) => {
    try {
        const driverId = req.user.id;
        const { reportType, page = 1, limit = 10 } = req.query;

        let query = { generatedBy: driverId };
        if (reportType) {
            query.reportType = reportType;
        }

        const reports = await Report.find(query)
            .populate('bus', 'busNumber busName')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Report.countDocuments(query);

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
        console.error('🔴 Get reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching reports'
        });
    }
};

// 🟢 GET SINGLE REPORT
const getReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const driverId = req.user.id;

        const report = await Report.findOne({ _id: reportId, generatedBy: driverId })
            .populate('bus', 'busNumber busName busType route.source route.destination')
            .populate('generatedBy', 'name email phone');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.json({
            success: true,
            data: report,
            message: 'Report fetched successfully'
        });

    } catch (error) {
        console.error('🔴 Get report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching report'
        });
    }
};

// 🟢 DELETE REPORT
const deleteReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const driverId = req.user.id;

        const report = await Report.findOne({ _id: reportId, generatedBy: driverId });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        await Report.findByIdAndDelete(reportId);

        res.json({
            success: true,
            message: 'Report deleted successfully'
        });

    } catch (error) {
        console.error('🔴 Delete report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting report'
        });
    }
};

module.exports = {
    generateDailyReport,
    generatePerformanceReport,
    reportIncident,
    getMyReports,
    getReport,
    deleteReport
};