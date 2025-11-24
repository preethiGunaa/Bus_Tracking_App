const express = require('express');
const {
    getDashboardStats,
    getAllReports,
    getAllBuses,
    getAllUsers,
    generateSystemReport,
    deleteUser,
    deleteBus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 🛡️ ALL ROUTES PROTECTED - Admins only
router.use(protect);
router.use(authorize('admin'));

// 🟢 DASHBOARD & ANALYTICS
router.get('/dashboard/stats', getDashboardStats);
router.post('/reports/system', generateSystemReport);

// 🟢 DATA MANAGEMENT
router.get('/reports', getAllReports);
router.get('/buses', getAllBuses);
router.get('/users', getAllUsers);

// 🟢 ADMIN ACTIONS
router.delete('/users/:userId', deleteUser);
router.delete('/buses/:busId', deleteBus);

module.exports = router;