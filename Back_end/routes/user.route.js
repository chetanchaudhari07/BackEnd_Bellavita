const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req,res)=>{
    try {
        const {name,email,password,mobile,role} = req.body;

        const user = await User.findOne({ email })

        if(user){
            return response.json({
                message : "Already register email",
                error : true,
                success : false
            })
        };



        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({name,
            email,
            password : hashedPassword,
            mobile,
            role});

        await newUser.save();
        res.status(201).json({message:"user regiister successfully"})
    } catch (error) {
        res.status(400).json(error);
    }
});

// login
router.post('/login', async (req,res)=>{
    try {
        const {email,password}= req.body;

        if(!email || !password){
            return res.status(400).json({message:"provide email, password" })
        };
         
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User not register"});
        };

        const isPasswordValid = await bcrypt.compare(password,user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password!" });
        
        const token = jwt.sign(
            {userId:user._id,role:user.role},
            process.env.SECRET_KEY,
            {expiresIn:"1d"}
        );

    res.json({token,role:user.role});

    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;