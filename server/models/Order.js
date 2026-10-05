const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true }, // Saved price at checkout time
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      phone: { type: String, required: true },
    },

    orderStatus: {
      type: String,
      required: true,
      enum: ['Order Placed', 'Packed', 'Shipped', 'Delivered'],
      default: 'Order Placed',
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    itemsPrice: {
      type: Number,
      default: 0.0,
    },
    deliveryCharge: {
      type: Number,
      default: 0.0,
    },
    distanceKm: {
      type: Number,
      default: 0.0,
    },
    totalWeight: {
      type: Number,
      default: 0.0,
    },
    trackingNumber: {
      type: String,
      default: '',
    },
    deliveryCoordinates: {
      lat: { type: Number, default: 11.92786 },
      lng: { type: Number, default: 78.18288 }
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
