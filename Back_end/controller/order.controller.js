const Cartprodduct = require('../models/cartproduct');
const Order = require('../models/order');
const User = require('../models/user');
const mongoose = require('mongoose');

const  CashOnDeliveryOrderController = async (req,res) =>{
    try {
        const userId = req.userId;
        const {list_items, totalAmt, addressId, subTotalAmt} = req.body;

        const payload = list_items.map(el => ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            product_details: {
                name: el.productId.name,
                image: el.productId.image
            },
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        }));

        const generatedOrder = await Order.insertMany(payload);
        await Cartprodduct.deleteMany({userId:userId});
        await User.updateOne({ _id: userId}, { shopping_cart: [] });

        return response.json({ message: "Order successfully created",data: generatedOrder });



    } catch (error) {
         return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

const getOrderDetailsController = async (req,res)=> {
    try {
        const userId = request.userId;

        const orderlist = await Order.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('delivery_address');

        return response.json({
            message: "Order list retrieved",
            data: orderlist,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

module.exports = {
    CashOnDeliveryOrderController,
    getOrderDetailsController
}