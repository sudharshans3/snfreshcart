const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const connectDB = require('../config/db');

dotenv.config();

const ATLAS_URI = 'mongodb+srv://sudharshans2023cse_db_user:BuBuy9gHnzxFFjdx@cluster0.1k6s6kc.mongodb.net/fresh_onion_mart?retryWrites=true&w=majority';

// Connect to DB
const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || ATLAS_URI);
    console.log('MongoDB Atlas Connected for seeding...');

    // Clear current database content
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('Existing DB content cleared.');

    // 1. Seed Users
    const admin = await User.create({
      name: 'Fresh Mart Admin',
      email: 'admin@onionmart.com',
      password: 'admin123',
      role: 'admin',
      phone: '+919876543210',
      address: {
        street: 'Kanavaipudur, Kadayampatti (T.K)',
        city: 'Salem',
        state: 'Tamil Nadu',
        zip: '636354'
      }
    });

    const customer = await User.create({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password123',
      role: 'customer',
      phone: '+919998887776',
      address: {
        street: '52 Harvest Avenue',
        city: 'Pune',
        state: 'Maharashtra',
        zip: '411001'
      }
    });

    const deliveryBoy = await User.create({
      name: 'Fresh Onion Delivery',
      email: 'delivery@onionmart.com',
      password: 'delivery123',
      role: 'delivery',
      phone: '+919876543222',
      address: {
        street: 'Kanavaipudur, Kadayampatti (T.K)',
        city: 'Salem',
        state: 'Tamil Nadu',
        zip: '636354'
      }
    });

    console.log('Users seeded:');
    console.log(`- Admin: admin@onionmart.com (pw: admin123)`);
    console.log(`- Customer: john@gmail.com (pw: password123)`);
    console.log(`- Delivery: delivery@onionmart.com (pw: delivery123)`);

    // Helper to generate last 15 days of price history
    const generatePriceHistory = (basePrice, variance) => {
      const history = [];
      const now = new Date();
      for (let i = 15; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        // Price fluctuations
        const price = Math.round((basePrice + (Math.random() * variance * 2 - variance)) * 100) / 100;
        history.push({ price, date });
      }
      return history;
    };

    // 2. Seed Products
    const productsData = [
      {
        name: 'Premium Red Onion',
        description: 'Crisp, sweet and spicy red onions. Perfect for salads, cooking, and sandwich toppings. Sourced directly from Nashik farms.',
        category: 'Red Onion',
        image: '/red_onion.png',
        pricePerKg: 45,
        stock: 5000,
        unit: 'kg',
        dailyPriceHistory: generatePriceHistory(45, 5)
      },
      {
        name: 'Fresh Small Onion (Shallots)',
        description: 'Tiny, highly flavored small onions. Essential for traditional South Indian Sambar and curries. Rich in nutrients.',
        category: 'Small Onion (Shallots)',
        image: '/small_onion.png',
        pricePerKg: 95,
        stock: 5000,
        unit: 'kg',
        dailyPriceHistory: generatePriceHistory(95, 8)
      },
      {
        name: 'Organic Fresh Potatoes',
        description: 'High quality farm-fresh potatoes, perfect for roasting, baking, or boiling. Rich in starch and flavor.',
        category: 'Potato',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600',
        pricePerKg: 30,
        stock: 4000,
        unit: 'kg',
        dailyPriceHistory: generatePriceHistory(30, 3)
      },
      {
        name: 'Premium White Garlic',
        description: 'Pungent and extremely aromatic whole garlic bulbs. Perfect for seasoning and cooking.',
        category: 'Garlic',
        image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&q=80&w=600',
        pricePerKg: 140,
        stock: 2500,
        unit: 'kg',
        dailyPriceHistory: generatePriceHistory(140, 15)
      },
      {
        name: 'Fresh Tender Coconuts',
        description: 'Sweet and refreshing green coconuts sourced directly from organic orchards. High in water content and nutrient rich.',
        category: 'Coconut',
        image: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&q=80&w=600',
        pricePerKg: 55,
        stock: 3000,
        unit: 'kg',
        dailyPriceHistory: generatePriceHistory(55, 6)
      }
    ];

    const seededProducts = await Product.create(productsData);
    console.log('Products seeded successfully.');

    // 3. Seed Reviews
    const reviewsData = [
      {
        user: customer._id,
        userName: customer.name,
        product: seededProducts[0]._id, // Red Onion
        rating: 5,
        comment: 'Very fresh and solid quality onions. The delivery was quick, and the prices are much better than local markets!'
      },
      {
        user: customer._id,
        userName: customer.name,
        product: seededProducts[1]._id, // Shallots
        rating: 4,
        comment: 'The shallots are clean and dry, making them long-lasting. Perfect for making traditional Sambar!'
      }
    ];

    await Review.create(reviewsData);
    console.log('Product reviews seeded.');

    // 4. Seed Orders and Payments (Generate past sales trends for the dashboard chart)
    const now = new Date();
    const orderItemsList = [
      [
        {
          name: seededProducts[0].name,
          qty: 50,
          price: 43,
          product: seededProducts[0]._id
        }
      ],
      [
        {
          name: seededProducts[1].name,
          qty: 15,
          price: 92,
          product: seededProducts[1]._id
        }
      ],
      [
        {
          name: seededProducts[0].name,
          qty: 100,
          price: 45,
          product: seededProducts[0]._id
        },
        {
          name: seededProducts[1].name,
          qty: 40,
          price: 95,
          product: seededProducts[1]._id
        }
      ],
      [
        {
          name: seededProducts[0].name,
          qty: 80,
          price: 45,
          product: seededProducts[0]._id
        }
      ]
    ];

    // Seed 4 sample paid orders spanning the last 7 days
    for (let i = 0; i < orderItemsList.length; i++) {
      const items = orderItemsList[i];
      const totalAmount = items.reduce((sum, item) => sum + item.qty * item.price, 0);
      const daysAgo = (4 - i) * 2; // orders placed 8, 6, 4, 2 days ago
      const orderDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Create Order
      const order = new Order({
        user: customer._id,
        orderItems: items,
        shippingAddress: {
          street: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          zip: customer.address.zip,
          phone: customer.phone
        },
        orderStatus: i === 3 ? 'Delivered' : (i === 2 ? 'Shipped' : 'Packed'),
        totalAmount: totalAmount,
        trackingNumber: 'FOM-' + (200000 + i * 147),
        emailSent: true,
        createdAt: orderDate,
        updatedAt: orderDate
      });

      const savedOrder = await order.save();

    }

    console.log('Historical sales seeded.');
    console.log('Seeding complete. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
