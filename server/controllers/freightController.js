const FreightConfig = require('../models/FreightConfig');

// @desc    Get current active freight configuration
// @route   GET /api/freight/config
// @access  Public (for automated customer delivery calculation & admin view)
const getFreightConfig = async (req, res, next) => {
  try {
    let config = await FreightConfig.findOne().sort({ createdAt: -1 });
    if (!config) {
      config = await FreightConfig.create({
        baseCharge: 800,
        ratePerKm: 22,
        ratePerKg: 0.50,
        pricingMode: 'slab',
        slab1Rate: 500,
        slab2Rate: 1000,
        slab3Rate: 1800,
        slab4Rate: 2800,
        slab4PerKmExtra: 12,
      });
    }
    res.json(config);
  } catch (error) {
    next(error);
  }
};

// @desc    Update freight rates and hub configuration (Admin Only)
// @route   PUT /api/freight/config
// @access  Private/Admin
const updateFreightConfig = async (req, res, next) => {
  try {
    const {
      baseCharge,
      ratePerKm,
      ratePerKg,
      pricingMode,
      slab1Rate,
      slab2Rate,
      slab3Rate,
      slab4Rate,
      slab4PerKmExtra,
      tier1MinKg,
      tier2MinKg,
      tier3MinKg,
      hubCity,
      hubAddress,
    } = req.body;

    let config = await FreightConfig.findOne().sort({ createdAt: -1 });

    if (!config) {
      config = new FreightConfig();
    }

    if (baseCharge !== undefined) config.baseCharge = Math.max(0, Number(baseCharge));
    if (ratePerKm !== undefined) config.ratePerKm = Math.max(0, Number(ratePerKm));
    if (ratePerKg !== undefined) config.ratePerKg = Math.max(0, Number(ratePerKg));

    // Distance Category Slabs (Admin Only Configuration)
    if (pricingMode !== undefined) config.pricingMode = pricingMode === 'per_km' ? 'per_km' : 'slab';
    if (slab1Rate !== undefined) config.slab1Rate = Math.max(0, Number(slab1Rate));
    if (slab2Rate !== undefined) config.slab2Rate = Math.max(0, Number(slab2Rate));
    if (slab3Rate !== undefined) config.slab3Rate = Math.max(0, Number(slab3Rate));
    if (slab4Rate !== undefined) config.slab4Rate = Math.max(0, Number(slab4Rate));
    if (slab4PerKmExtra !== undefined) config.slab4PerKmExtra = Math.max(0, Number(slab4PerKmExtra));

    if (tier1MinKg !== undefined) config.tier1MinKg = Math.max(100, Number(tier1MinKg));
    if (tier2MinKg !== undefined) config.tier2MinKg = Math.max(100, Number(tier2MinKg));
    if (tier3MinKg !== undefined) config.tier3MinKg = Math.max(100, Number(tier3MinKg));
    if (hubCity) config.hubCity = hubCity;
    if (hubAddress) config.hubAddress = hubAddress;

    if (req.user) {
      config.updatedBy = req.user._id;
    }

    const savedConfig = await config.save();

    console.log(`[Freight Rates Updated by Admin ${req.user?.name || ''}] Mode: ${savedConfig.pricingMode}, Slabs: 1-50km: ₹${savedConfig.slab1Rate}, 50-100km: ₹${savedConfig.slab2Rate}, 100-150km: ₹${savedConfig.slab3Rate}, 150+km: ₹${savedConfig.slab4Rate}`);

    res.json({
      message: 'Freight configuration updated successfully',
      config: savedConfig,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFreightConfig,
  updateFreightConfig,
};
