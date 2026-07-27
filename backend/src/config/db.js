import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Server will continue without database connection for testing purposes');
    // Don't exit the process - allow the server to run for testing
    // process.exit(1);
  }
};

export default connectDB;

// This file is responsible for connecting to the MongoDB database using Mongoose.
// It exports a function that establishes the connection and handles errors appropriately.