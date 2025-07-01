// configs/mongodb.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  mongoose.connection.on('connected', () =>
    console.log('📦 Connected to DB:', mongoose.connection.name)
  );

  await mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
