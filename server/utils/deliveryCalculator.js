/**
 * Delivery & Freight Calculator for Wholesale Produce
 * Warehouse Location: Salem Dispatch Hub, Tamil Nadu (lat: 11.92786, lng: 78.18288)
 */

const WAREHOUSE_COORDS = {
  lat: 11.92786,
  lng: 78.18288,
  address: 'Kanavaipudur, Kadayampatti (T.K)',
  city: 'Salem',
  state: 'Tamil Nadu',
  zip: '636354',
};

// Pre-cached coordinates for Indian cities to guarantee instant and reliable resolution
const CITY_COORDINATES = {
  salem: { lat: 11.6643, lng: 78.1460, state: 'Tamil Nadu' },
  kanavaipudur: { lat: 11.92786, lng: 78.18288, state: 'Tamil Nadu' },
  omlur: { lat: 11.7456, lng: 78.0416, state: 'Tamil Nadu' },
  dharmapuri: { lat: 12.1277, lng: 78.1579, state: 'Tamil Nadu' },
  namakkal: { lat: 11.2189, lng: 78.1674, state: 'Tamil Nadu' },
  erode: { lat: 11.3410, lng: 77.7172, state: 'Tamil Nadu' },
  coimbatore: { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
  tiruppur: { lat: 11.1085, lng: 77.3411, state: 'Tamil Nadu' },
  tiruchirappalli: { lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
  trichy: { lat: 10.7905, lng: 78.7047, state: 'Tamil Nadu' },
  madurai: { lat: 9.9252, lng: 78.1198, state: 'Tamil Nadu' },
  dindigul: { lat: 10.3673, lng: 77.9803, state: 'Tamil Nadu' },
  karur: { lat: 10.9601, lng: 78.0766, state: 'Tamil Nadu' },
  vellore: { lat: 12.9165, lng: 79.1325, state: 'Tamil Nadu' },
  hosur: { lat: 12.7409, lng: 77.8253, state: 'Tamil Nadu' },
  chennai: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
  kanchipuram: { lat: 12.8342, lng: 79.7036, state: 'Tamil Nadu' },
  thanjavur: { lat: 10.7870, lng: 79.1378, state: 'Tamil Nadu' },
  tirunelveli: { lat: 8.7139, lng: 77.7567, state: 'Tamil Nadu' },
  kanyakumari: { lat: 8.0883, lng: 77.5385, state: 'Tamil Nadu' },
  
  // Karnataka
  bangalore: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  bengaluru: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
  mysore: { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  mysuru: { lat: 12.2958, lng: 76.6394, state: 'Karnataka' },
  mangalore: { lat: 12.9141, lng: 74.8560, state: 'Karnataka' },
  hubli: { lat: 15.3647, lng: 75.1240, state: 'Karnataka' },
  belgaum: { lat: 15.8497, lng: 74.4977, state: 'Karnataka' },
  
  // Andhra Pradesh & Telangana
  hyderabad: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
  secunderabad: { lat: 17.4399, lng: 78.4983, state: 'Telangana' },
  vijayawada: { lat: 16.5062, lng: 80.6480, state: 'Andhra Pradesh' },
  visakhapatnam: { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  vizag: { lat: 17.6868, lng: 83.2185, state: 'Andhra Pradesh' },
  tirupati: { lat: 13.6288, lng: 79.4192, state: 'Andhra Pradesh' },
  guntur: { lat: 16.3067, lng: 80.4365, state: 'Andhra Pradesh' },
  kurnool: { lat: 15.8281, lng: 78.0373, state: 'Andhra Pradesh' },
  
  // Maharashtra
  nashik: { lat: 20.0084, lng: 73.7898, state: 'Maharashtra' },
  pune: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
  mumbai: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
  thane: { lat: 19.2183, lng: 72.9781, state: 'Maharashtra' },
  navi_mumbai: { lat: 19.0330, lng: 73.0297, state: 'Maharashtra' },
  aurangabad: { lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
  chhatrapati_sambhajinagar: { lat: 19.8762, lng: 75.3433, state: 'Maharashtra' },
  nagpur: { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
  kolhapur: { lat: 16.7050, lng: 74.2433, state: 'Maharashtra' },
  solapur: { lat: 17.6599, lng: 75.9064, state: 'Maharashtra' },
  
  // Kerala
  kochi: { lat: 9.9312, lng: 76.2673, state: 'Kerala' },
  ernakulam: { lat: 9.9816, lng: 76.2999, state: 'Kerala' },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  trivandrum: { lat: 8.5241, lng: 76.9366, state: 'Kerala' },
  kozhikode: { lat: 11.2588, lng: 75.7804, state: 'Kerala' },
  calicut: { lat: 11.2588, lng: 75.7804, state: 'Kerala' },
  palakkad: { lat: 10.7867, lng: 76.6548, state: 'Kerala' },
  
  // Gujarat & North / Central
  ahmedabad: { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
  surat: { lat: 21.1702, lng: 72.8311, state: 'Gujarat' },
  vadodara: { lat: 22.3072, lng: 73.1812, state: 'Gujarat' },
  rajkot: { lat: 22.3039, lng: 70.8022, state: 'Gujarat' },
  delhi: { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  new_delhi: { lat: 28.6139, lng: 77.2090, state: 'Delhi' },
  noida: { lat: 28.5355, lng: 77.3910, state: 'Uttar Pradesh' },
  gurgaon: { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  gurugram: { lat: 28.4595, lng: 77.0266, state: 'Haryana' },
  jaipur: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
  indore: { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh' },
  bhopal: { lat: 23.2599, lng: 77.4126, state: 'Madhya Pradesh' },
  kolkata: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
  lucknow: { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
};

/**
 * Calculate Great-Circle Distance using Haversine formula with road transit factor (1.25x)
 */
const calculateHaversineRoadDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineDistance = R * c;

  // Road factor: Driving routes wind through highways and ring roads (~1.22 - 1.25x straight line)
  const estimatedRoadDistance = Math.round(straightLineDistance * 1.25);
  return Math.max(10, estimatedRoadDistance); // Minimum 10 km
};

/**
 * Resolve coordinates for a given city / address
 */
const resolveCoordinates = (address) => {
  if (!address) return { lat: 11.6643, lng: 78.1460, source: 'default' };

  if (address.lat && address.lng) {
    return { lat: Number(address.lat), lng: Number(address.lng), source: 'provided' };
  }

  const rawCity = (address.city || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (CITY_COORDINATES[rawCity]) {
    return { ...CITY_COORDINATES[rawCity], source: 'city_cache' };
  }

  // Check if city name contains any of the known keys
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (rawCity.includes(key) || key.includes(rawCity)) {
      return { ...coords, source: 'city_fuzzy' };
    }
  }

  // State-level fallbacks if city wasn't matched
  const rawState = (address.state || '').trim().toLowerCase();
  if (rawState.includes('tamil') || rawState.includes('tn')) {
    return { lat: 11.6643, lng: 78.1460, source: 'state_default' }; // Salem
  }
  if (rawState.includes('karnataka')) {
    return { lat: 12.9716, lng: 77.5946, source: 'state_default' }; // Bangalore
  }
  if (rawState.includes('maharashtra')) {
    return { lat: 18.5204, lng: 73.8567, source: 'state_default' }; // Pune
  }
  if (rawState.includes('kerala')) {
    return { lat: 9.9312, lng: 76.2673, source: 'state_default' }; // Kochi
  }
  if (rawState.includes('andhra') || rawState.includes('telangana')) {
    return { lat: 17.3850, lng: 78.4867, source: 'state_default' }; // Hyderabad
  }

  // Default to Pune / central fallback if unknown
  return { lat: 18.5204, lng: 73.8567, source: 'general_default' };
};

/**
 * Tiered Minimum Bulk Order Requirements by Distance from Salem Hub:
 * - < 100 km: Minimum 2,000 kg (2 Metric Tons)
 * - 100 km to 150 km: Minimum 5,000 kg (5 Metric Tons)
 * - 150+ km: Minimum 10,000 kg (10 Metric Tons)
 */
const getMinOrderWeight = (distanceKm, customConfig) => {
  const tier3Min = customConfig?.tier3MinKg || 10000;
  const tier2Min = customConfig?.tier2MinKg || 5000;
  const tier1Min = customConfig?.tier1MinKg || 2000;

  if (distanceKm >= 150) {
    return {
      minWeight: tier3Min,
      tierLabel: '150+ km (Interstate Long-Haul)',
      tierDescription: `Minimum ${tier3Min.toLocaleString()} kg (${tier3Min / 1000} MT) required for freight beyond 150 km`
    };
  }
  if (distanceKm >= 100) {
    return {
      minWeight: tier2Min,
      tierLabel: '100 - 150 km (Regional Freight)',
      tierDescription: `Minimum ${tier2Min.toLocaleString()} kg (${tier2Min / 1000} MT) required for regional transit (100-150 km)`
    };
  }
  return {
    minWeight: tier1Min,
    tierLabel: '< 100 km (Local Hub Dispatch)',
    tierDescription: `Minimum ${tier1Min.toLocaleString()} kg (${tier1Min / 1000} MT) required for local dispatch under 100 km`
  };
};

/**
 * Resolves distance category and distance charge based on customConfig
 * Categories:
 * 1. 1 to 50 km: Category 1 (Local Hub Dispatch) -> slab1Rate
 * 2. 50 to 100 km: Category 2 (Sub-Regional Delivery) -> slab2Rate
 * 3. 100 to 150 km: Category 3 (Regional Freight) -> slab3Rate
 * 4. 150+ km: Category 4 (Interstate Long-Haul) -> slab4Rate + extra beyond 150 km
 */
const getDistanceCategoryDetails = (distanceKm, customConfig = null) => {
  // Rates in Rs / km assigned by Admin
  const s1 = customConfig?.slab1Rate !== undefined ? Number(customConfig.slab1Rate) : 25;
  const s2 = customConfig?.slab2Rate !== undefined ? Number(customConfig.slab2Rate) : 22;
  const s3 = customConfig?.slab3Rate !== undefined ? Number(customConfig.slab3Rate) : 20;
  const s4 = customConfig?.slab4Rate !== undefined ? Number(customConfig.slab4Rate) : 18;

  // Sanitize if legacy flat rate was previously saved in db (>100)
  const slab1Rate = s1 > 100 ? 25 : s1;
  const slab2Rate = s2 > 100 ? 22 : s2;
  const slab3Rate = s3 > 100 ? 20 : s3;
  const slab4Rate = s4 > 100 ? 18 : s4;

  let categoryId = 1;
  let categoryRange = '1 to 50 km';
  let categoryLabel = 'Local Hub Dispatch (≤ 50 km)';
  let perKmRateApplied = slab1Rate;

  if (distanceKm > 150) {
    categoryId = 4;
    categoryRange = '150+ km';
    categoryLabel = 'Interstate Long-Haul (150+ km)';
    perKmRateApplied = slab4Rate;
  } else if (distanceKm > 100) {
    categoryId = 3;
    categoryRange = '100 to 150 km';
    categoryLabel = 'Regional Freight (100–150 km)';
    perKmRateApplied = slab3Rate;
  } else if (distanceKm > 50) {
    categoryId = 2;
    categoryRange = '50 to 100 km';
    categoryLabel = 'Sub-Regional Dispatch (50–100 km)';
    perKmRateApplied = slab2Rate;
  } else {
    categoryId = 1;
    categoryRange = '1 to 50 km';
    categoryLabel = 'Local Hub Dispatch (≤ 50 km)';
    perKmRateApplied = slab1Rate;
  }

  // Distance Charge = km * admin added Rs / km!
  const distanceCharge = Math.round(distanceKm * perKmRateApplied);

  return {
    categoryId,
    categoryRange,
    categoryLabel,
    slabRate: perKmRateApplied,
    perKmRateApplied,
    distanceCharge,
    pricingMode: 'per_km',
    perKmRate: perKmRateApplied,
    slab1Rate,
    slab2Rate,
    slab3Rate,
    slab4Rate,
    slab4PerKmExtra: 12,
  };
};

/**
 * Calculate distance and weight-based delivery charge
 * Pricing Policy (Admin Configurable):
 * - Distance Category Slabs:
 *     1 to 50 km: ₹500 (or custom ₹ set by admin)
 *     50 to 100 km: ₹1,000 (or custom ₹ set by admin)
 *     100 to 150 km: ₹1,800 (or custom ₹ set by admin)
 *     150+ km: ₹2,800 + ₹12/km extra (or custom ₹ set by admin)
 * - Base Loading & Logistics Fee: ₹800
 * - Weight Rate: ₹0.50 / kg
 * - Formula: Delivery Charge = Base Fee + Distance Category Slab Charge + (weight_in_kg * ratePerKg)
 */
const calculateDeliveryDetails = (shippingAddress, totalWeight = 2000, customConfig = null) => {
  let distanceKm;
  let customerCoords;

  if (shippingAddress && (shippingAddress.distanceKm !== undefined && shippingAddress.distanceKm !== null && shippingAddress.distanceKm !== '')) {
    distanceKm = Math.max(1, Math.round(Number(shippingAddress.distanceKm)));
    customerCoords = shippingAddress.coords || resolveCoordinates(shippingAddress);
  } else {
    customerCoords = resolveCoordinates(shippingAddress);
    distanceKm = calculateHaversineRoadDistance(
      WAREHOUSE_COORDS.lat,
      WAREHOUSE_COORDS.lng,
      customerCoords.lat,
      customerCoords.lng
    );
  }

  const tierInfo = getMinOrderWeight(distanceKm, customConfig);
  const minWeightRequired = tierInfo.minWeight;
  const weight = Number(totalWeight) || minWeightRequired;
  const isMinWeightMet = weight >= minWeightRequired;
  const weightShortfall = Math.max(0, minWeightRequired - weight);

  const categoryDetails = getDistanceCategoryDetails(distanceKm, customConfig);
  const baseHandlingFee = customConfig?.baseCharge !== undefined ? Number(customConfig.baseCharge) : 800;
  const rawPerKg = customConfig?.ratePerKg !== undefined ? Number(customConfig.ratePerKg) : 0.50;
  const perKgRate = rawPerKg > 10 ? 0.50 : rawPerKg;

  const distanceCharge = categoryDetails.distanceCharge;
  const weightCharge = Math.round(weight * perKgRate);
  const deliveryCharge = Math.round(baseHandlingFee + distanceCharge + weightCharge);
  const effectivePerKg = weight > 0 ? Number((deliveryCharge / weight).toFixed(2)) : 0;

  return {
    origin: {
      hub: 'Salem Dispatch Warehouse',
      city: customConfig?.hubCity || WAREHOUSE_COORDS.city,
      state: customConfig?.hubState || WAREHOUSE_COORDS.state,
      coords: {
        lat: customConfig?.hubLat || WAREHOUSE_COORDS.lat,
        lng: customConfig?.hubLng || WAREHOUSE_COORDS.lng
      }
    },
    destination: {
      city: shippingAddress?.city || 'Unknown',
      state: shippingAddress?.state || '',
      coords: { lat: customerCoords.lat, lng: customerCoords.lng }
    },
    distanceKm,
    totalWeight: weight,
    minWeightRequired,
    isMinWeightMet,
    weightShortfall,
    tier: tierInfo,
    category: categoryDetails,
    pricing: {
      baseHandlingFee,
      distanceCategory: categoryDetails.categoryLabel,
      distanceCategoryRange: categoryDetails.categoryRange,
      distanceSlabRate: categoryDetails.slabRate,
      distanceCharge,
      pricingMode: categoryDetails.pricingMode,
      perKmRate: categoryDetails.perKmRate,
      perKgRate,
      weightCharge,
      effectivePerKg,
      totalDeliveryCharge: deliveryCharge,
    },
    deliveryCharge,
  };
};

module.exports = {
  WAREHOUSE_COORDS,
  CITY_COORDINATES,
  calculateHaversineRoadDistance,
  resolveCoordinates,
  getMinOrderWeight,
  getDistanceCategoryDetails,
  calculateDeliveryDetails,
};
