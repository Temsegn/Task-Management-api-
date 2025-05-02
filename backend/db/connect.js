// db.js
import mongoose from 'mongoose';

const connection='mongodb://localhost:27017/taskDB';

async function connectToDB() {
  try {
    await mongoose.connect(connection, {
     
    });
    console.log('✅ Connected to MongoDB (Mongoose)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

export default connectToDB;