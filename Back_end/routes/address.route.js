const express = require("express");
const { addAddress, getAddresses, updateAddress, deleteAddress, } = require('../controller/address.controller');
const auth = require('../middleware/auth');


const router = express.Router();

// Add a new address
router.post("/add-address", auth, addAddress);


// Get all addresses for a user
router.get("/get-address", auth, getAddresses);

// Update an existing address
router.put("/:addressId", auth, updateAddress);

// Delete an address
router.delete("/:addressId", auth, deleteAddress);

module.exports = router;