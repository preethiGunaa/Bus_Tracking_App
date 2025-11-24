const Bus = require('../models/Bus');

// 🟢 SEARCH AVAILABLE BUSES - SIMPLIFIED VERSION

// 🟢 CALCULATE FARE BETWEEN TWO STOPS
const searchBuses = async (req, res) => {
    try {
        const { source, destination, busType } = req.query;

        console.log('🔍 Search request received:', { source, destination, busType });

        if (!source || !destination) {
            return res.status(400).json({
                success: false,
                message: 'Source and destination are required'
            });
        }

        // 🔴 DEBUG: First, let's see ALL buses in the database
        const allBuses = await Bus.find({});
        console.log('🟡 ALL BUSES IN DATABASE:', allBuses.length);
        allBuses.forEach(bus => {
            console.log(`- ${bus.busName} (${bus.busNumber}): ${bus.route.source} -> ${bus.route.destination}`);
        });

        // Build search query - UPDATED FOR YOUR NEW SCHEMA
        let query = {
            $and: [
                {
                    $or: [
                        { 'route.source': { $regex: `^${source}$`, $options: 'i' } },
                        { 'route.source': { $regex: source, $options: 'i' } },
                        { 'route.source': { $regex: new RegExp(source, 'i') } }
                    ]
                },
                {
                    $or: [
                        { 'route.destination': { $regex: `^${destination}$`, $options: 'i' } },
                        { 'route.destination': { $regex: destination, $options: 'i' } },
                        { 'route.destination': { $regex: new RegExp(destination, 'i') } }
                    ]
                }
            ]
        };

        // Add bus type filter if specified
        if (busType && busType !== '') {
            query.busType = busType;
        }

        // Add active status check - using your new schema field
        query['currentStatus.isActive'] = true;

        console.log('🟡 FINAL MONGODB QUERY:', JSON.stringify(query, null, 2));

        const buses = await Bus.find(query)
            .populate('driver', 'name contact')
            .select('-__v');

        console.log(`✅ Search found ${buses.length} buses`);

        // 🔴 DEBUG: Show what was found
        if (buses.length > 0) {
            buses.forEach(bus => {
                console.log(`🎯 FOUND: ${bus.busName} (${bus.busNumber}) - ${bus.route.source} -> ${bus.route.destination}`);
            });
        } else {
            console.log('❌ No buses found with current query');

            // 🔴 DEBUG: Let's try a more flexible search
            console.log('🟡 Trying flexible search...');
            const flexibleBuses = await Bus.find({
                $or: [
                    {
                        'route.source': { $regex: source, $options: 'i' },
                        'route.destination': { $regex: destination, $options: 'i' }
                    }
                ],
                'currentStatus.isActive': true
            });
            console.log(`🟡 Flexible search found: ${flexibleBuses.length} buses`);
        }

        res.status(200).json({
            success: true,
            count: buses.length,
            data: buses,
            message: buses.length > 0
                ? `Found ${buses.length} buses for ${source} to ${destination}`
                : `No buses found for ${source} to ${destination}. Try different locations.`
        });

    } catch (error) {
        console.error('🔴 Search buses error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching buses',
            error: error.message
        });
    }
};
const calculateFare = async (req, res) => {
    try {
        const { busId } = req.params;
        const { fromStop, toStop } = req.query;

        if (!fromStop || !toStop) {
            return res.status(400).json({
                success: false,
                message: 'Please provide fromStop and toStop'
            });
        }

        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        const fromStopData = bus.route.stops.find(stop =>
            stop.stopName.toLowerCase().includes(fromStop.toLowerCase()));
        const toStopData = bus.route.stops.find(stop =>
            stop.stopName.toLowerCase().includes(toStop.toLowerCase()));

        if (!fromStopData || !toStopData) {
            return res.status(400).json({
                success: false,
                message: 'Invalid stop names provided'
            });
        }

        if (fromStopData.stopOrder >= toStopData.stopOrder) {
            return res.status(400).json({
                success: false,
                message: 'Source stop must come before destination stop'
            });
        }

        const fare = Math.abs(toStopData.fareFromSource - fromStopData.fareFromSource);
        const distance = Math.abs(toStopData.distanceFromSource - fromStopData.distanceFromSource);

        res.json({
            success: true,
            data: {
                busNumber: bus.busNumber,
                busName: bus.busName,
                fromStop: fromStopData.stopName,
                toStop: toStopData.stopName,
                fare,
                distance: `${distance} km`,
                estimatedTime: `~${Math.round(distance * 2)} mins`
            },
            message: 'Fare calculated successfully'
        });
    } catch (error) {
        console.error('🔴 Fare calculation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while calculating fare'
        });
    }
};

// 🟢 GET ALL STOPS OF A BUS
const getBusStops = async (req, res) => {
    try {
        const { busId } = req.params;
        const bus = await Bus.findById(busId).select('busNumber busName route.stops');

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        res.json({
            success: true,
            data: {
                busNumber: bus.busNumber,
                busName: bus.busName,
                stops: bus.route.stops
            },
            message: 'Stops retrieved successfully'
        });
    } catch (error) {
        console.error('🔴 Error fetching stops:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching stops'
        });
    }
};

// 🟢 REGISTER A NEW BUS
const registerBus = async (req, res) => {
    try {
        const {
            busNumber,
            busName,
            busType,
            govtAgency,
            operatorName,
            contactNumber,
            route,
            schedule,
            currentStatus
        } = req.body;

        // Check if bus number already exists
        const busExists = await Bus.findOne({ busNumber });
        if (busExists) {
            return res.status(400).json({
                success: false,
                message: 'Bus with this number already exists'
            });
        }

        // Create new bus with driver info from authenticated user
        const bus = await Bus.create({
            busNumber,
            busName,
            busType,
            govtAgency: busType === 'government' ? govtAgency : undefined,
            operatorName: busType === 'private' ? operatorName : undefined,
            contactNumber: busType === 'private' ? contactNumber : undefined,
            driver: req.user.id, // From auth middleware
            route,
            schedule,
            currentStatus: currentStatus || {
                isActive: true,
                availableToday: true
            }
        });

        const populatedBus = await Bus.findById(bus._id).populate('driver', 'name email');

        res.status(201).json({
            success: true,
            data: populatedBus,
            message: 'Bus registered successfully'
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        console.error('🔴 Bus registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during bus registration'
        });
    }
};

// 🟢 GET DRIVER'S REGISTERED BUSES
const getMyBuses = async (req, res) => {
    try {
        const driverId = req.user.id; // From auth middleware

        const buses = await Bus.find({ driver: driverId })
            .populate('driver', 'name email');

        res.json({
            success: true,
            count: buses.length,
            data: buses
        });
    } catch (error) {
        console.error('🔴 Error fetching my buses:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching buses'
        });
    }
};

// 🟢 TOGGLE BUS AVAILABILITY
const toggleBusAvailability = async (req, res) => {
    try {
        const { busId } = req.params;
        const { availableToday } = req.body;

        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        // Check if driver owns this bus
        if (bus.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bus'
            });
        }

        bus.currentStatus.availableToday = availableToday;
        await bus.save();

        res.json({
            success: true,
            data: bus,
            message: `Bus ${availableToday ? 'activated' : 'deactivated'} successfully`
        });

    } catch (error) {
        console.error('🔴 Error toggling availability:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating bus availability'
        });
    }
};

// 🟢 UPDATE BUS DETAILS
const updateBusDetails = async (req, res) => {
    try {
        const { busId } = req.params;
        const updateData = req.body;

        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({
                success: false,
                message: 'Bus not found'
            });
        }

        // Check if driver owns this bus
        if (bus.driver.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bus'
            });
        }

        // Update bus details
        const updatedBus = await Bus.findByIdAndUpdate(
            busId,
            updateData,
            { new: true, runValidators: true }
        ).populate('driver', 'name email');

        res.json({
            success: true,
            data: updatedBus,
            message: 'Bus details updated successfully'
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        console.error('🔴 Error updating bus details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating bus details'
        });
    }
};

// ✅ EXPORT ALL FUNCTIONS
module.exports = {
    searchBuses,
    calculateFare,
    getBusStops,
    registerBus,
    getMyBuses,
    toggleBusAvailability,
    updateBusDetails
};