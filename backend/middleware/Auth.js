import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false, 
            message: "Unauthorized - Please login first" 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Fetch the full user data from the database
        const user = await UserModel.findById(decoded.id).select('-password'); // Exclude password
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        // 3. Attach the full user object to req.user
        req.user = user;
        
        next();
    } catch (error) {
        let message = "Authentication failed";
        
        if (error.name === 'TokenExpiredError') {
            message = "Token expired";
        } else if (error.name === 'JsonWebTokenError') {
            message = "Invalid token";
        }

        return res.status(401).json({ 
            success: false, 
            message 
        });
    }
};

export default authMiddleware;