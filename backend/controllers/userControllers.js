const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Register
const createUser = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
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
      message: "User created successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select(['-password']);
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
  const { id } = req.body;
  try {
    const user = await User.findById(id).select(['-password']);
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
  const { id, ...updateData } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updateData, {
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
  const { id } = req.body;
  try {
    const user = await User.findByIdAndDelete(id);
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
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
