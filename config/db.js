const mongoose = require('mongoose');
const colors = require('colors');
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL,);
        console.log(`Connected to MongoDB Database: ${mongoose.connection.host}`.blue.bold);
    }catch (error) {
        console.log(`Error: ${error.message}`.red.underline);
    }
};
module.exports = connectDB;