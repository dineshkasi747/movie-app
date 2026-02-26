import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const protect = (req, res, next) => {
  try {
    // Get token from request headers
    const authHeader = req.headers.authorization;

    // Check if token exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '❌ No token provided, access denied' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object for use in controllers
    req.user = decoded;

    next(); // Move to next middleware or controller
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '❌ Token expired, please login again' });
    }
    return res.status(401).json({ message: '❌ Invalid token, access denied' });
  }
};

export { protect };