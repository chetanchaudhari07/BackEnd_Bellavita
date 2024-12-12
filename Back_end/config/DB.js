const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.log("Mongodb connect error", error);
    }
};

module.exports = connect;