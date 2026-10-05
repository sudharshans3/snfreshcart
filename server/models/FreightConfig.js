const mongoose = require('mongoose');

const freightConfigSchema = new mongoose.Schema(
  {
    baseCharge: {
      type: Number,
      required: true,
      default: 800, // Updated from 500 to 800
    },
    ratePerKm: {
      type: Number,
      required: true,
      default: 22, // Updated to 22 rs per km
    },
    ratePerKg: {
      type: Number,
      required: true,
      default: 0.50, // Standard 0.50 rs per kg
    },
    // Distance Categories / Slabs (Configurable in Rs by Admin Only)
    pricingMode: {
      type: String,
      enum: ['slab', 'per_km'],
      default: 'slab',
    },
    slab1Rate: {
      type: Number,
      required: true,
      default: 25, // Rs / km for Method 1 (1 to 50 km)
    },
    slab2Rate: {
      type: Number,
      required: true,
      default: 22, // Rs / km for Method 2 (50 to 100 km)
    },
    slab3Rate: {
      type: Number,
      required: true,
      default: 20, // Rs / km for Method 3 (100 to 150 km)
    },
    slab4Rate: {
      type: Number,
      required: true,
      default: 18, // Rs / km for Method 4 (150+ km)
    },
    slab4PerKmExtra: {
      type: Number,
      default: 12, // Extra Rs per km beyond 150 km
    },
    hubAddress: {
      type: String,
      default: 'Kanavaipudur, Kadayampatti (T.K)',
    },
    hubCity: {
      type: String,
      default: 'Salem',
    },
    hubState: {
      type: String,
      default: 'Tamil Nadu',
    },
    hubZip: {
      type: String,
      default: '636354',
    },
    hubLat: {
      type: Number,
      default: 11.92786,
    },
    hubLng: {
      type: Number,
      default: 78.18288,
    },
    tier1MinKg: {
      type: Number,
      default: 2000,
    },
    tier2MinKg: {
      type: Number,
      default: 5000,
    },
    tier3MinKg: {
      type: Number,
      default: 10000,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const FreightConfig = mongoose.model('FreightConfig', freightConfigSchema);
module.exports = FreightConfig;
