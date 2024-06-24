const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Register
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = (await User.countDocuments({})) === 0 ? "admin" : "user";

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    await user.save();
    res.json({
      status: 1,
      message: "Registration success!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, phone, password } = req.body;
  try {
    // const user = await User.findOne({ email });
    const user = await User.findOne({
      $or: [{ email: email || null }, { phone: phone || null }],
    });

    // console.log("user:", user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    // console.log("isValidPassword:", isValidPassword);

    if (!isValidPassword) {
      return res.status(400).json({ message: "Password is incorrect!" });
    }

    const token = generateToken(user); // generate JWT token

    res.json({
      status: 1,
      message: "Login success!",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  login,
};
