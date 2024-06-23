const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, token });

        if (!user) {
            throw new Error();
        }

        req.user = user;
        req.token = token;

        // Check user role for authorization
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticate;
