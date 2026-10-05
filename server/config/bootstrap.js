const User = require('../models/User');

const bootstrapUsers = async () => {
  try {
    // 1. Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@onionmart.com' });
    if (!adminExists) {
      await User.create({
        name: 'Fresh Mart Admin',
        email: 'admin@onionmart.com',
        password: 'admin123',
        role: 'admin',
        phone: '+919876543210',
        address: {
          street: '101 Onion Plaza, Main Road',
          city: 'Nashik',
          state: 'Maharashtra',
          zip: '422001'
        }
      });
      console.log('Seeded default Admin user on startup.');
    }

    // 2. Check if customer exists
    const customerExists = await User.findOne({ email: 'john@gmail.com' });
    if (!customerExists) {
      await User.create({
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
      console.log('Seeded default Customer user on startup.');
    }

    // 3. Check if delivery boy exists
    const deliveryExists = await User.findOne({ email: 'delivery@onionmart.com' });
    if (!deliveryExists) {
      await User.create({
        name: 'Fresh Onion Delivery',
        email: 'delivery@onionmart.com',
        password: 'delivery123',
        role: 'delivery',
        phone: '+919876543222',
        address: {
          street: '88 Transit Hub Road',
          city: 'Nashik',
          state: 'Maharashtra',
          zip: '422003'
        }
      });
      console.log('Seeded default Delivery boy user on startup.');
    }
  } catch (error) {
    console.error('Failed to bootstrap users:', error.message);
  }
};

module.exports = bootstrapUsers;
