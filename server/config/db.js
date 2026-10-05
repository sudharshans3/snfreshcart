const mongoose = require('mongoose');
const bootstrapUsers = require('./bootstrap');

const ATLAS_URI = 'mongodb+srv://sudharshans2023cse_db_user:BuBuy9gHnzxFFjdx@cluster0.1k6s6kc.mongodb.net/'

let retryTimeout = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || ATLAS_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 6000,
    });
    console.log(`\n============================================================`);
    console.log(`🚀 MongoDB Atlas Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`============================================================\n`);

    // Seed default accounts automatically on startup if missing
    await bootstrapUsers();
  } catch (error) {
    console.error('\n============================================================');
    console.error(`❌ MongoDB Atlas Connection Failed: ${error.message}`);
    console.error('============================================================');
    console.error(`
📌 ACTION REQUIRED IN MONGODB ATLAS:
Your Atlas cluster is rejecting the connection because your current IP is not whitelisted.

Follow these 4 simple steps to allow access:
1. Open MongoDB Atlas: https://cloud.mongodb.com
2. In the left menu under 'SECURITY', click 'Network Access'
3. Click the '+ ADD IP ADDRESS' button
4. Select 'ALLOW ACCESS FROM ANYWHERE' (IP: 0.0.0.0/0) or 'ADD CURRENT IP ADDRESS'
5. Click 'Confirm'

⏳ Waiting for Atlas IP Whitelist... Retrying in 10 seconds automatically.
============================================================\n`);

    if (!retryTimeout) {
      retryTimeout = setTimeout(() => {
        retryTimeout = null;
        connectDB();
      }, 10000);
    }
  }
};

module.exports = connectDB;
