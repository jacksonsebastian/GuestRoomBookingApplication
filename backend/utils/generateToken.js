const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
};

module.exports = generateToken;
