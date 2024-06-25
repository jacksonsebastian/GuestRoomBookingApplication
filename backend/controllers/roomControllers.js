const Room = require("../models/roomModel");

// Create a new room
const createRoom = async (req, res) => {
  const { ownerId, rooms } = req.body;
  try {

    rooms.forEach(room => {
      room.ownerId = ownerId;
    });

    const createdRooms = await Room.insertMany(rooms);

    res.status(201).json({
      status: 1,
      message: "Rooms created successfully",
      responseData: createdRooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room by ID
const updateRoom = async (req, res) => {
  const { rooms } = req.body;
  try {
    const updatePromises = rooms.map(async (room) => {
      const updatedRoom = await Room.findByIdAndUpdate(room.id, room, {
        new: true,
        runValidators: true,
      });
      if (!updatedRoom) {
        return res.status(404).json({ message: `Room ${room.id} not found` });
      }
      return updatedRoom;
    });

    const updatedRooms = await Promise.all(updatePromises);
    res.status(200).json({
      status: 1,
      message: "Rooms updated successfully",
      rooms: updatedRooms,
    });
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
