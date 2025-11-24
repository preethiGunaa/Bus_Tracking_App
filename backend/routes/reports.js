const express = require('express');
const {
    generateDailyReport,
    generatePerformanceReport,
    reportIncident,
    getMyReports,
    getReport,
    deleteReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 🛡️ ALL ROUTES PROTECTED - Drivers and Admins only
router.use(protect);
router.use(authorize('driver', 'admin'));

// 🟢 REPORT GENERATION ROUTES
router.post('/daily', generateDailyReport);
router.post('/performance', generatePerformanceReport);
router.post('/incident', reportIncident);

// 🟢 REPORT MANAGEMENT ROUTES
router.get('/my-reports', getMyReports);
router.get('/:reportId', getReport);
router.delete('/:reportId', deleteReport);

module.exports = router;