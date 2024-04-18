import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError.js";

const authenticateToken = (req, res, next) => {
    try {
        // const authorization = req.headers.authorization
        // if (!authorization) {
        //     return res.status(401).json({ error: 'Token Not Found' });
        // }

        const token = req.headers.authorization.split(' ')[1];
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

export {
    authenticateToken
}