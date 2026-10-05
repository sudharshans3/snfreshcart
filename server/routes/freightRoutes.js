const express = require('express');
const router = express.Router();
const { getFreightConfig, updateFreightConfig } = require('../controllers/freightController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/config', getFreightConfig);
router.put('/config', protect, admin, updateFreightConfig);

module.exports = router;
