const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a report title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a report description']
    },
    reportType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'incident', 'maintenance', 'financial', 'performance'],
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: function () { return this.reportType !== 'financial'; }
    },
    period: {
        startDate: {
            type: Date,
            required: function () {
                return ['daily', 'weekly', 'monthly', 'performance'].includes(this.reportType);
            }
        },
        endDate: {
            type: Date,
            required: function () {
                return ['weekly', 'monthly', 'performance'].includes(this.reportType);
            }
        }
    },
    data: {
        totalTrips: Number,
        totalRevenue: Number,
        totalDistance: Number,
        totalPassengers: Number,
        maintenanceCost: Number,
        fuelCost: Number,
        incidents: [{
            type: {
                type: String,
                enum: ['breakdown', 'accident', 'delay', 'other']
            },
            description: String,
            date: Date,
            severity: {
                type: String,
                enum: ['low', 'medium', 'high']
            }
        }],
        performanceMetrics: {
            onTimeRate: Number, // percentage
            occupancyRate: Number, // percentage
            customerSatisfaction: Number // rating 1-5
        }
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    fileUrl: String // For PDF exports
}, {
    timestamps: true
});

// Index for efficient querying
reportSchema.index({ reportType: 1, 'period.startDate': -1 });
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ bus: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);