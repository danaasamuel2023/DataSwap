const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function dropPhoneNumberIndex() {
  try {
    const uri = process.env.MONGO_URI_LEGACY || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI_LEGACY (or MONGO_URI) must be set');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    // Get the collection
    const collection = mongoose.connection.collection('usernashes');
    
    // Drop the index
    await collection.dropIndex('phoneNumber_1');
    console.log('Successfully dropped phoneNumber_1 index');
    
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error dropping index:', error);
  }
}

// Run the function
dropPhoneNumberIndex();