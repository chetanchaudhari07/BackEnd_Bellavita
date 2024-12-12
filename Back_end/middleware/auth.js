const jwt = require("jsonwebtoken");
require('dotenv').config();


const auth = (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Token not provided." });
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid token." });
            }
            req.userId = decoded.userId;
            req.role = decoded.role;
            next();
        });
    } catch (error) {
        return res.status(500).json({ message: "Authentication error." });
    }
};


module.exports = auth;
