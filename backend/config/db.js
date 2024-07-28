const mongoose = require('mongoose');

const MONGO_URI='mongodb+srv://akasheducation10:RiOs8X8OMbpkCGnq@cluster0.m7i8xqg.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
