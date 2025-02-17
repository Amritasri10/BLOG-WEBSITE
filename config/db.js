require('dotenv').config();
const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        console.log(`MongoDB URI:`.bgMagenta, process.env.MONGO_URL.bgMagenta); // Debugging

        await mongoose.connect(process.env.MONGO_URL);

        console.log(`Connected to MongoDB Database`.blue.bold);
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline);
    }
};

module.exports = connectDB;
