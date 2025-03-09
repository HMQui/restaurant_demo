const jwt = require("jsonwebtoken");
require('dotenv').config()

const verifyToken = async (req, res, next) => {
    try {        
        const token = req.cookies?.token; // Get token from HTTP-only cookies
        
        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        // Verify token using secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach idUser to request object
        req.userId = decoded.id;

        next(); // Proceed to next middleware/controller
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;
