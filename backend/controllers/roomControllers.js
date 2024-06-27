const Room = require("../models/roomModel");

// Create a new room
const createRoom = async (req, res) => {
  const { ownerId, rooms } = req.body;
  try {
    rooms.forEach((room) => {
      room.ownerId = ownerId;
    });

    const createdRooms = await Room.insertMany(rooms);

    res.status(201).json({
      status: 1,
      message: "Rooms created successfully!",
      // responseData: createdRooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room by ID
const updateRoom = async (req, res) => {
  const { rooms } = req.body;

  try {
    // Validate all rooms before update
    for (const room of rooms) {
      const existingRoom = await Room.findById(room.roomId);
      if (!existingRoom) {
        throw new Error(`Room Id ${room.roomId} not found`);
      }
    }

    // If all rooms exist, update all room
    const updatedRooms = await Promise.all(
      rooms.map(async (room) => {
        const updatedRoom = await Room.findByIdAndUpdate(room.roomId, room, {
          new: true,
          runValidators: true,
        });

        if (!updatedRoom) {
          throw new Error(`Failed to update Room Id ${room.roomId}`);
        }

        return updatedRoom;
      })
    );

    res.status(200).json({
      status: 1,
      message: "Rooms updated successfully!",
      // rooms: updatedRooms,
    });
  } catch (error) {
    if (error.message.includes("Room")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// Get all rooms
const getAllRooms = async (req, res) => {
  const { startDate, endDate } = req.body;

  try {
    // Find all rooms
    const rooms = await Room.find();

    if (!startDate || !endDate) {
      // If no startDate and endDate are provided, return all rooms
      return res.json({ status: 1, message: "All rooms details!", rooms });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the number of days between startDate and endDate
    const bookingPeriod = (end - start) / (1000 * 60 * 60 * 24) + 1; // +1 to include the start date

    // Filter rooms based on the booking period
    const filteredRooms = rooms.filter(
      (room) =>
        bookingPeriod >= room.minBookingPeriod &&
        bookingPeriod <= room.maxBookingPeriod
    );

    res.json({
      status: 1,
      message: "Filtered rooms details!",
      rooms: filteredRooms,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to calculate booking period in days
function calculateBookingPeriod(startDate, endDate) {
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Helper function to calculate booking period in days
function calculateBookingPeriod(startDate, endDate) {
  const diffTime = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Adding 1 to include both start and end dates
  return diffDays;
}

// Get room by ID
const getRoomById = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }
    res.json({ status: 1, message: "Room found!", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete room by ID
const deleteRoom = async (req, res) => {
  const { roomId } = req.body;
  try {
    const room = await Room.findByIdAndDelete(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }
    res.json({ status: 1, message: "Room deleted successfully!" });
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
