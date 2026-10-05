const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const ATLAS_URI = 'mongodb+srv://sudharshans2023cse_db_user:BuBuy9gHnzxFFjdx@cluster0.1k6s6kc.mongodb.net/fresh_onion_mart?retryWrites=true&w=majority';

const addProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || ATLAS_URI);
    console.log('MongoDB Atlas Connected...');

    const products = [
      {
        name: 'Premium Russet Potatoes',
        description: 'Perfect for mashing, baking, or frying. Crisp skins and fluffy texture.',
        category: 'Potato',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600',
        pricePerKg: 35,
        stock: 4500,
        unit: 'kg',
        dailyPriceHistory: [{ price: 35, date: new Date() }]
      },
      {
        name: 'Organic Garlic Bulbs',
        description: 'Fresh, strong-flavored garlic. Ideal for seasoning curries, pastas, and roasts.',
        category: 'Garlic',
        image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
        pricePerKg: 130,
        stock: 2000,
        unit: 'kg',
        dailyPriceHistory: [{ price: 130, date: new Date() }]
      },
      {
        name: 'Fresh Raw Coconut',
        description: 'Rich in healthy fats, fresh grated meat, and sweet water. Sourced from organic coastal farms.',
        category: 'Coconut',
        image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=600',
        pricePerKg: 60,
        stock: 1500,
        unit: 'kg',
        dailyPriceHistory: [{ price: 60, date: new Date() }]
      }
    ];

    for (const prod of products) {
      // Check if product with this name already exists
      const exists = await Product.findOne({ name: prod.name });
      if (!exists) {
        await Product.create(prod);
        console.log(`Created product: ${prod.name}`);
      } else {
        console.log(`Product already exists: ${prod.name}`);
      }
    }

    console.log('Products check and addition complete.');
    process.exit(0);
  } catch (error) {
    console.error('Error adding products:', error);
    process.exit(1);
  }
};

addProducts();
