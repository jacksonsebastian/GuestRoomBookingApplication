const User = require("../models/userModel");
const bcrpt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Register
const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrpt.genSalt(10);
    const hashedPassword = await bcrpt.hash(password, salt) 
    const user = new User({ name, email, phone, password : hashedPassword });
    await user.save();
    res.status(201).json({
      status: 1,
      message: "Registration success!",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login 
const login = async (req, res) =>{
  const { name, email } = req.body;
  try {
    const userData = await User.findOne({ email, password });
    if (!userData) {
        return res.status(400).json({ message: 'Email not exists!' });
    }

    const isValidPassword = bcrpt.compare(email, userData.password);

    if(!isValidPassword){
      return res.status(400).json({ message: 'Password is incorrect!' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
