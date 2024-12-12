const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connect = require('./config/DB');
const userrouter = require('./routes/user.route');
const productrouter = require('./routes/product.router')
const uploadrouter = require('./routes/upload');
const orderrouter = require('./routes/order.route');
const cartrouter = require('./routes/cart.route');
const addressrouter = require('./routes/address.route');






require("dotenv").config();

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors({
    origin: "http://localhost:5173", // Update to match your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
}));

app.use('/api/users', userrouter);
app.use('/api/product', productrouter);
// app.use('/api/', uploadrouter);
app.use('/api/', orderrouter);
app.use('/api/', cartrouter);
app.use('/api/address', addressrouter);



app.get('/', async (req,res)=>{
    res.send('ok');
});



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    next(err);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, async ()=>{
    try {
        await connect();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to connect to database', error.message);
        process.exit(1);
    }
});






