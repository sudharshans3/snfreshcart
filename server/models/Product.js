const mongoose = require('mongoose');

const dailyPriceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      enum: ['Red Onion', 'White Onion', 'Small Onion (Shallots)', 'Potato', 'Garlic', 'Coconut', 'Other'],
    },
    image: {
      type: String, // URL path or base64 data URI
      default: '',
    },
    pricePerKg: {
      type: Number,
      required: true,
      default: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    dailyPriceHistory: [dailyPriceHistorySchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
