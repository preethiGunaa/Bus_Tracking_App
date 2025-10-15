const express = require('express');
const {
    searchBuses,
    calculateFare,
    getBusStops,
    registerBus,
    getMyBuses,
    toggleBusAvailability,
    updateBusDetails
} = require('../controllers/busController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// 🟢 PUBLIC ROUTES (No authentication needed)
router.get('/search', searchBuses);
router.get('/:busId/fare', calculateFare);
router.get('/:busId/stops', getBusStops);

// 🛡️ PROTECTED ROUTES (Authentication required)
router.post('/', protect, authorize('driver', 'admin'), registerBus);
router.get('/my-buses', protect, authorize('driver', 'admin'), getMyBuses);
router.patch('/:busId/availability', protect, authorize('driver', 'admin'), toggleBusAvailability);
router.put('/:busId', protect, authorize('driver', 'admin'), updateBusDetails);

module.exports = router;