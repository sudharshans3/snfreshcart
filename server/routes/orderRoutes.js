const express = require('express');
const router = express.Router();
const {
  createOrder,
  getDeliveryEstimate,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getSalesAnalytics,
  updateOrderLocation,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, admin, deliveryOrAdmin } = require('../middleware/authMiddleware');

router.post('/calculate-delivery', getDeliveryEstimate);

router.route('/')
  .post(protect, createOrder)
  .get(protect, deliveryOrAdmin, getAllOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/analytics/sales', protect, admin, getSalesAnalytics);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, admin, updateOrder)
  .delete(protect, admin, deleteOrder);

router.put('/:id/status', protect, deliveryOrAdmin, updateOrderStatus);
router.put('/:id/location', protect, deliveryOrAdmin, updateOrderLocation);

module.exports = router;
