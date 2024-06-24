const Room = require("../models/roomModel");

// Create a new room
const createRoom = async (req, res) => {
  const { ownerId, name, floorSize, numberOfBeds, amenities,minBookingPeriod, maxBookingPeriod, rentAmount } =
    req.body;
  try {
    const room = new Room({
      ownerId,
      name,
      floorSize,
      numberOfBeds,
      amenities,
      minBookingPeriod,
      maxBookingPeriod,
      rentAmount,
    });
    await room.save();
    res
      .status(201)
      .json({ status: 1, message: "Room created successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json({ status: 1, message: "All rooms fetched successfully", rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get room by ID
const getRoomById = async (req, res) => {
  const { id } = req.body;
  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ status: 1, message: "Room found", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room by ID
const updateRoom = async (req, res) => {
  const { id, ...updateData } = req.body;
  try {
    const room = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ status: 1, message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete room by ID
const deleteRoom = async (req, res) => {
  const { id } = req.body;
  try {
    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json({ status: 1, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
};
