const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getCustomers,
  registerAdmin,
  getAdmins,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.get('/customers', protect, admin, getCustomers);
router.post('/register-admin', protect, admin, registerAdmin);
router.get('/admins', protect, admin, getAdmins);

module.exports = router;
