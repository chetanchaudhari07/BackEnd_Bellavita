const Address = require('../models/adress');
const User = require('../models/user');

// Add a new address
const addAddress = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from auth middleware
        const { address_line, city, state, pincode, country, mobile } = req.body;
        console.log("User ID:", req.userId); // Should log the decoded userId
        console.log("Role:", req.role);

        const newAddress = new Address({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId,
        });

        const savedAddress = await newAddress.save();

        // Update user's address_details with the new address ID
        await User.updateOne({ _id: userId }, { $push: { address_details: savedAddress._id } });

        res.json({
            message: "Address added successfully",
            success: true,
            data: savedAddress,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error adding address",
            success: false,
        });
    }
};

// Get all addresses for a user
const getAddresses = async (req, res) => {
    try {
        const userId = req.userId;

        const addresses = await Address.find({ userId });

        res.json({
            message: "Addresses retrieved successfully",
            success: true,
            data: addresses,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error retrieving addresses",
            success: false,
        });
    }
};

// Update an address
const updateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;
        const updateData = req.body;

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: addressId, userId },
            updateData,
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({
                message: "Address not found or not authorized",
                success: false,
            });
        }

        res.json({
            message: "Address updated successfully",
            success: true,
            data: updatedAddress,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error updating address",
            success: false,
        });
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;

        const address = await Address.findOne({ _id: addressId, userId });

        if (!address) {
            return res.status(404).json({
                message: "Address not found or not authorized",
                success: false,
            });
        }

        await Address.deleteOne({ _id: addressId });

        // Remove the address ID from user's address_details
        await User.updateOne({ _id: userId }, { $pull: { address_details: addressId } });

        res.json({
            message: "Address deleted successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Error deleting address",
            success: false,
        });
    }
};

module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
};