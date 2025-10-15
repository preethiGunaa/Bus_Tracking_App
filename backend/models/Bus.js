const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
    stopName: {
        type: String,
        required: true
    },
    stopOrder: {
        type: Number,
        required: true  // 1, 2, 3... to maintain sequence
    },
    location: {
        lat: Number,
        lng: Number
    },
    distanceFromSource: {
        type: Number,  // in kilometers
        required: true
    },
    estimatedTimeFromSource: {
        type: String,  // "15 mins", "45 mins"
        required: true
    },
    fareFromSource: {
        type: Number,  // ticket amount from starting point
        required: true
    }
});

const busSchema = new mongoose.Schema({
    // Basic Bus Info
    busNumber: {
        type: String,
        required: [true, 'Please add bus number'],
        unique: true,
        trim: true
    },
    busName: {
        type: String,
        required: [true, 'Please add bus name/route name'],
        trim: true
    },

    // 🎯 BUS TYPE - CORE FEATURE
    busType: {
        type: String,
        enum: ['government', 'private', 'contract', 'shuttle'],
        required: [true, 'Please specify bus type']
    },

    // Government Bus Specific
    govtAgency: {
        type: String,
        required: function () { return this.busType === 'government'; }
    },

    // Private Bus Specific
    operatorName: {
        type: String,
        required: function () { return this.busType === 'private'; }
    },
    contactNumber: String,

    // Driver Relationship
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // 🎯 COMPREHENSIVE ROUTE SYSTEM
    route: {
        source: {
            type: String,
            required: [true, 'Please add starting point']
        },
        destination: {
            type: String,
            required: [true, 'Please add destination']
        },
        totalDistance: {  // Total route distance
            type: Number,
            required: true
        },
        totalDuration: {  // Total journey time
            type: String,
            required: true
        },
        totalFare: {  // Maximum fare (source to destination)
            type: Number,
            required: true
        },
        // 🎯 DETAILED STOPS WITH FARES
        stops: [stopSchema]
    },

    // Schedule & Timing
    schedule: {
        firstTrip: String,
        lastTrip: String,
        frequency: String,
        operatingDays: {
            type: [String],
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }
    },

    // Real-time Status
    currentStatus: {
        isActive: {
            type: Boolean,
            default: true
        },
        availableToday: {
            type: Boolean,
            default: true
        },
        currentLocation: {
            lat: Number,
            lng: Number,
            lastUpdated: Date
        },
        currentStop: String,  // Which stop bus is currently at
        nextStop: String,
        estimatedArrival: String
    },

    // Fare Calculation Method
    fareCalculation: {
        type: String,
        enum: ['fixed', 'distance_based', 'stop_based'],
        default: 'stop_based'
    }

}, {
    timestamps: true
});

// 🎯 METHOD TO FIND STOP BY NAME (with partial matching)
busSchema.methods.findStopByName = function (stopName) {
    return this.route.stops.find(stop =>
        stop.stopName.toLowerCase().includes(stopName.toLowerCase())
    );
};

// 🎯 METHOD TO VALIDATE ROUTE BETWEEN TWO STOPS
busSchema.methods.isValidRoute = function (fromStop, toStop) {
    const fromStopData = this.findStopByName(fromStop);
    const toStopData = this.findStopByName(toStop);

    return fromStopData && toStopData && fromStopData.stopOrder < toStopData.stopOrder;
};

// 🎯 METHOD TO CALCULATE FARE BETWEEN ANY TWO STOPS
busSchema.methods.calculateFare = function (fromStop, toStop) {
    const fromStopData = this.findStopByName(fromStop);
    const toStopData = this.findStopByName(toStop);

    if (!fromStopData || !toStopData) {
        throw new Error('Invalid stop names');
    }

    if (fromStopData.stopOrder >= toStopData.stopOrder) {
        throw new Error('Source stop must come before destination stop');
    }

    return Math.abs(toStopData.fareFromSource - fromStopData.fareFromSource);
};

// 🎯 METHOD TO GET DISTANCE BETWEEN ANY TWO STOPS
busSchema.methods.getDistance = function (fromStop, toStop) {
    const fromStopData = this.findStopByName(fromStop);
    const toStopData = this.findStopByName(toStop);

    if (!fromStopData || !toStopData) {
        throw new Error('Invalid stop names');
    }

    if (fromStopData.stopOrder >= toStopData.stopOrder) {
        throw new Error('Source stop must come before destination stop');
    }

    return Math.abs(toStopData.distanceFromSource - fromStopData.distanceFromSource);
};

// Indexes for efficient searching
busSchema.index({ busType: 1, 'route.source': 1, 'route.destination': 1 });
busSchema.index({ 'route.stops.stopName': 1 });

module.exports = mongoose.model('Bus', busSchema);