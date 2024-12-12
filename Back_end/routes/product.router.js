const express = require('express');

const Product = require('../models/product');
const auth = require('../middleware/auth');
const checkAccess = require('../middleware/checkAccess');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const cloudinary = require('../utils/cloudinary');
// const upload = require('../middleware/multer');
const router = express.Router();



// GET Product 
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        return response.status(500).json({ message: error.message || error })
    }
})

// GET Product by category
router.get('/product-category', async (req, res) => {
    try {
        const { category } = req.body;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const products = await Product.find({ category });
        res.status(200).json(products)

    } catch (error) {
        res.status(500).json({ message: error.message || error });
    }
});




router.post('/add-Product', auth, checkAccess("ADMIN"), upload.array('image', 5), async (req, res) => {
    try {

        console.log('Uploaded Files:', req.files);
        const uploadedImages = await Promise.all(
            req.files.map((file) =>
                cloudinary.uploader.upload(file.path, { folder: 'products' })
            )
        );

        const imageUrls = uploadedImages.map((img) => img.secure_url);
        console.log('Uploaded Images URLs:', imageUrls);

        const { name, category, unit, stock, price, discount, description, more_details } = req.body;
        console.log('Request Body:', req.body);
        console.log('Uploaded Files:', req.files);

        if (!name || !category || !unit || !price || !description) {
            return res.status(400).json({ message: "Enter required fields" });
        }

        // const imageUrls = req.files.map(file => file.path);

        const product = new Product({
            name,
            image: imageUrls,
            category,
            unit,
            stock : stock || 0,
            price,
            discount : discount || 0,
            description,
            more_details,
        });

        await product.save();
        res.status(201).json({ message: "Product Created Successfully",data: product });
    } catch (error) {
        console.error('Error Stack:', error.stack || error); // Log the full error for debugging
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
});





//UPDATE Product Admin only
router.put("/update-product/:id", auth, checkAccess("ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (error) {
        res.status(500).json({ message: error.message || error });
    }
})


// DELETE Product Admin only
router.delete("/delete-product/:id", auth, checkAccess("ADMIN"), async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || error });
    }
});


module.exports = router;






