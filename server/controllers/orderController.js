const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');
const FreightConfig = require('../models/FreightConfig');
const { calculateDeliveryDetails } = require('../utils/deliveryCalculator');

// Helper to simulate email confirmation sending in the logs
const sendMockEmail = (order, user) => {
  console.log(`\n======================================================================`);
  console.log(`📧 MOCK EMAIL NOTIFICATION SENT`);
  console.log(`To: ${user.email}`);
  console.log(`Subject: SN FreshCart - Order Confirmation #${order._id}`);
  console.log(`----------------------------------------------------------------------`);
  console.log(`Dear ${user.name},`);
  console.log(`Thank you for shopping with SN FreshCart! Your bulk wholesale order has been placed.`);
  console.log(`Total Weight: ${order.totalWeight || 0} kg`);
  console.log(`Produce Subtotal: INR ${(order.itemsPrice || 0).toFixed(2)}`);
  console.log(`Delivery Distance: ${order.distanceKm || 0} km (From Salem Hub)`);
  console.log(`Delivery Charge: INR ${(order.deliveryCharge || 0).toFixed(2)} (INR ${((order.deliveryCharge || 0) / (order.totalWeight || 2000)).toFixed(2)}/kg)`);
  console.log(`Grand Total Amount: INR ${order.totalAmount.toFixed(2)}`);
  console.log(`Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}`);
  console.log(`\nOrder Summary:`);
  order.orderItems.forEach((item) => {
    console.log(`- ${item.name} (${item.qty} kg) @ INR ${item.price}/kg = INR ${(item.qty * item.price).toFixed(2)}`);
  });
  console.log(`\nTrack your order in your Customer Dashboard. Current Status: Order Placed`);
  console.log(`======================================================================\n`);
};

// @desc    Calculate distance and delivery fee
// @route   POST /api/orders/calculate-delivery
// @access  Public
const getDeliveryEstimate = async (req, res, next) => {
  try {
    const shippingAddress = req.body.shippingAddress || req.body;
    const totalWeight = req.body.totalWeight || req.body.shippingAddress?.totalWeight || 2000;
    const distanceKm = req.body.distanceKm || req.body.shippingAddress?.distanceKm;
    const freightConfig = await FreightConfig.findOne().sort({ createdAt: -1 });
    const deliveryInfo = calculateDeliveryDetails({ ...shippingAddress, distanceKm }, totalWeight, freightConfig);
    res.json(deliveryInfo);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      return next(new Error('No order items provided'));
    }

    // Base wholesale minimum order check
    const totalWeight = orderItems.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
    const freightConfig = await FreightConfig.findOne().sort({ createdAt: -1 });
    const deliveryInfo = calculateDeliveryDetails(shippingAddress, totalWeight, freightConfig);
    const minRequired = 2000;

    if (totalWeight < minRequired) {
      res.status(400);
      return next(
        new Error(
          `Minimum wholesale order is ${minRequired.toLocaleString()} kg (${minRequired / 1000} MT). Current order is ${totalWeight.toLocaleString()} kg.`
        )
      );
    }

    // 1. Check stock for each item first
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        return next(new Error(`Product ${item.name} not found`));
      }
      if (product.stock < item.qty) {
        res.status(400);
        return next(new Error(`Insufficient stock for ${product.name}. Available: ${product.stock} kg, Requested: ${item.qty} kg`));
      }
    }

    // 2. Decrement product stock levels
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    // 3. Compute final totals
    const itemsPrice = orderItems.reduce((acc, item) => acc + (Number(item.qty) * Number(item.price)), 0);
    const deliveryCharge = req.body.deliveryCharge !== undefined ? Number(req.body.deliveryCharge) : 0;
    const distanceKm = req.body.distanceKm !== undefined ? Number(req.body.distanceKm) : (deliveryInfo?.distanceKm || 0);
    const finalTotalAmount = itemsPrice + deliveryCharge;

    // 4. Create the order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      itemsPrice,
      deliveryCharge,
      distanceKm,
      totalWeight,
      totalAmount: finalTotalAmount,
      orderStatus: 'Order Placed',
      trackingNumber: 'FOM-' + Math.floor(100000 + Math.random() * 900000),
      deliveryCoordinates: deliveryInfo.destination.coords,
    });

    const createdOrder = await order.save();

    // Create notifications for Admins and Delivery Partners
    try {
      const admins = await User.find({ role: 'admin' });
      const deliveryPartners = await User.find({ role: 'delivery' });

      const notificationPromises = [];
      const orderShortId = createdOrder._id.toString().substring(createdOrder._id.toString().length - 6).toUpperCase();

      // Notification for Admins
      admins.forEach((adminUser) => {
        notificationPromises.push(
          Notification.create({
            user: adminUser._id,
            title: 'New Wholesale Order Placed',
            message: `Order #${orderShortId} (${totalWeight} kg) placed by ${req.user.name}. Items: ₹${itemsPrice.toFixed(2)}, Freight (${distanceKm} km): ₹${deliveryCharge.toFixed(2)}. Total: ₹${finalTotalAmount.toFixed(2)}.`,
            type: 'success',
            orderId: createdOrder._id,
          })
        );
      });

      // Notification for Delivery Partners
      deliveryPartners.forEach((deliveryUser) => {
        notificationPromises.push(
          Notification.create({
            user: deliveryUser._id,
            title: 'New Bulk Shipment Available',
            message: `Order #${orderShortId} (${totalWeight} kg) ready for dispatch to ${shippingAddress.city} (${distanceKm} km). Freight: ₹${deliveryCharge.toFixed(2)}.`,
            type: 'info',
            orderId: createdOrder._id,
          })
        );
      });

      await Promise.all(notificationPromises);
    } catch (notifErr) {
      console.error('Failed to create order notifications:', notifErr);
    }

    // 5. Record order email status and send mock email
    createdOrder.emailSent = true;
    await createdOrder.save();

    sendMockEmail(createdOrder, req.user);

    res.status(201).json(createdOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Allow if admin, delivery partner, or the user who placed the order
      if (req.user.role === 'admin' || req.user.role === 'delivery' || order.user._id.toString() === req.user._id.toString()) {
        return res.json(order);
      } else {
        res.status(403);
        return next(new Error('Not authorized to view this order'));
      }
    } else {
      res.status(404);
      return next(new Error('Order not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order tracking status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    
    if (!['Order Placed', 'Packed', 'Shipped', 'Delivered'].includes(orderStatus)) {
      res.status(400);
      return next(new Error('Invalid order status'));
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      return next(new Error('Order not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales analytics data for Chart.js
// @route   GET /api/orders/analytics/sales
// @access  Private/Admin
const getSalesAnalytics = async (req, res, next) => {
  try {
    // 1. Total revenue (sum of all orders)
    const allOrders = await Order.find({});
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 2. Total orders count
    const totalOrdersCount = await Order.countDocuments();

    // 3. Status breakdown
    const orderStatusCounts = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    // 4. Sales aggregated by date (last 30 days)
    const salesOverTime = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 5. Sales by Category
    const categorySales = await Order.aggregate([
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$productInfo.category',
          totalQty: { $sum: '$orderItems.qty' },
          totalSales: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
        },
      },
    ]);

    // 6. Products stock overview and daily prices
    const products = await Product.find({}, 'name category pricePerKg stock dailyPriceHistory');

    res.json({
      totalRevenue,
      totalOrdersCount,
      orderStatusCounts,
      salesOverTime,
      categorySales,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order delivery coordinates
// @route   PUT /api/orders/:id/location
// @access  Private (Delivery / Admin)
const updateOrderLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      res.status(400);
      return next(new Error('Please provide both lat and lng coordinates'));
    }

    const order = await Order.findById(req.params.id);

    if (order) {
      order.deliveryCoordinates = { lat, lng };
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      return next(new Error('Order not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order details (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    const {
      orderStatus,
      shippingAddress,
      trackingNumber,
      deliveryCharge,
      totalAmount,
    } = req.body;

    if (orderStatus) {
      if (!['Order Placed', 'Packed', 'Shipped', 'Delivered'].includes(orderStatus)) {
        res.status(400);
        return next(new Error('Invalid order status'));
      }
      order.orderStatus = orderStatus;
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = trackingNumber;
    }

    if (shippingAddress) {
      order.shippingAddress = {
        street: shippingAddress.street || order.shippingAddress.street,
        city: shippingAddress.city || order.shippingAddress.city,
        state: shippingAddress.state || order.shippingAddress.state,
        zip: shippingAddress.zip || order.shippingAddress.zip,
        phone: shippingAddress.phone || order.shippingAddress.phone,
      };
    }

    if (deliveryCharge !== undefined) {
      order.deliveryCharge = Number(deliveryCharge);
    }

    if (totalAmount !== undefined) {
      order.totalAmount = Number(totalAmount);
    }

    const updatedOrder = await order.save();

    // Create notification for customer if order status updated
    if (orderStatus && order.user) {
      try {
        await Notification.create({
          user: order.user,
          title: `Order Status Updated: ${orderStatus}`,
          message: `Your order #${order._id.toString().slice(-6).toUpperCase()} status was updated to "${orderStatus}".`,
          type: orderStatus === 'Delivered' ? 'success' : 'info',
        });
      } catch (nErr) {
        console.error('Notification creation failed:', nErr.message);
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      return next(new Error('Order not found'));
    }

    // Restore stock to products if order was not delivered yet
    if (order.orderStatus !== 'Delivered' && order.orderItems?.length > 0) {
      for (const item of order.orderItems) {
        if (item.product && item.qty) {
          try {
            await Product.findByIdAndUpdate(item.product, {
              $inc: { stock: Number(item.qty) },
            });
          } catch (pErr) {
            console.error(`Failed to restore stock for product ${item.product}:`, pErr.message);
          }
        }
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: 'Order removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};

