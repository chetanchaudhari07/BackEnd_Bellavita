const Cartproduct = require('../models/cartproduct');
const User = require('../models/user');
const mongoose = require('mongoose');

// Add a product to the cart
const addToCart = async (req, res) => {
    try {
        const userId = req.userId; // Auth middleware to provide userId
        const { productId, quantity } = req.body;

        const existingCartProduct = await Cartproduct.findOne({
            userId: userId,
            productId: productId,
        });

        if (existingCartProduct) {
            existingCartProduct.quantity += quantity || 1;
            await existingCartProduct.save();
            return res.json({
                message: "Product quantity updated in cart",
                success: true,
                data: existingCartProduct,
            });
        }

        const newCartProduct = new Cartproduct({
            userId,
            productId,
            quantity: quantity || 1,
        });

        await newCartProduct.save();

        await User.updateOne(
            { _id: userId },
            { $push: { shopping_cart: newCartProduct._id } }
        );

        res.json({
            message: "Product added to cart successfully",
            success: true,
            data: newCartProduct,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error adding product to cart",
            success: false,
        });
    }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { cartProductId } = req.params;

        const cartProduct = await Cartproduct.findOne({
            _id: cartProductId,
            userId: userId,
        });

        if (!cartProduct) {
            return res.status(404).json({
                message: "Cart product not found",
                success: false,
            });
        }

        await Cartproduct.deleteOne({ _id: cartProductId });

        await UserModel.updateOne(
            { _id: userId },
            { $pull: { shopping_cart: cartProductId } }
        );

        res.json({
            message: "Product removed from cart successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error removing product from cart",
            success: false,
        });
    }
};

// Get all products in the user's cart
const getCartProducts = async (req, res) => {
    try {
        const userId = req.userId;

        const cartProducts = await Cartproduct.find({ userId: userId }).populate("productId");

        res.json({
            message: "Cart products retrieved successfully",
            success: true,
            data: cartProducts,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error retrieving cart products",
            success: false,
        });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCartProducts,
};