const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('*_* DB connected');
    } catch (error) {
        console.log(error);
        process.exit(1);            //exit with failure
    }
}

module.exports = connectDB;