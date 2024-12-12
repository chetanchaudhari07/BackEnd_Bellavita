const express = require("express");
const { addToCart, removeFromCart, getCartProducts} = require('../controller/cart.controller');
const auth = require('../middleware/auth');

const router = express.Router();

// Route to add a product to the cart
router.post("/add", auth, addToCart);

// Route to remove a product from the cart
router.delete("/remove/:cartProductId", auth, removeFromCart);

// Route to get all products in the cart
router.get("/", auth, getCartProducts);

module.exports = router;