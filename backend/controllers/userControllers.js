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
    const role = (await User.countDocuments({})) === 0 ? 'admin' : 'user';
    
    const user = new User({ name, email, phone, password: hashedPassword, role });
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
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      // console.log("user:", user);
      if (!user) {
          return res.status(400).json({ message: "Email does not exist!" });
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

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({
      status: 1,
      message: "users details!",
      responseData: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      status: 1,
      message: "user details!",
      responseData: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      status: 1,
      message: "User updated successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({
      status: 1,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
