import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";

const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
    
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
    
            req.admin = admin;
            next();
        });
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
};

export{
    authenticateToken
}