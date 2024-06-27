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
  const { startDate, endDate, page, limit } = req.body;

  try {
    // Find all rooms
    const rooms = await Room.find();
    const totalCount = rooms.length;

    if (!startDate || !endDate) {
      // const paginatedRooms = rooms.slice((page - 1) * limit, page * limit);
      const paginatedRooms = rooms
        .slice((page - 1) * limit, page * limit)
        .map((room) => ({
          ...room.toObject(),
          isBooked: isRoomBooked(room.bookingStatus),
        }));
      // If no startDate and endDate are provided, return all rooms
      return res.json({
        status: 1,
        message: "All rooms details!",
        rooms: paginatedRooms,
        totalCount,
      });
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

    // const totalFilteredRooms = filteredRooms.length;
    // const paginatedRooms = filteredRooms.slice((page - 1) * limit, page * limit);
    const paginatedRooms = rooms
      .slice((page - 1) * limit, page * limit)
      .map((room) => ({
        ...room.toObject(),
        isBooked: isRoomBooked(room.bookingStatus),
      }));

    res.json({
      status: 1,
      message: "Filtered rooms details!",
      rooms: paginatedRooms,
      totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function isRoomBooked(bookingStatus) {
  if (!bookingStatus || !bookingStatus.endDate) {
    return false; // Assume not booked if no endDate is set
  }
  const currentDate = new Date();

  // console.log("===>",bookingStatus, currentDate)
  // console.log(">===>",currentDate >= new Date(bookingStatus.startDate))
  // console.log(">===>>",currentDate <= new Date(bookingStatus.endDate))
  return (
    currentDate >= new Date(bookingStatus.startDate) &&
    currentDate <= new Date(bookingStatus.endDate)
  );
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

const createBooking = async (req, res) => {
  const { roomId, startDate, endDate, adults, children } = req.body;
  const currentDate = new Date();

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.bookingStatus && room.bookingStatus.endDate) {
      const existingEndDate = new Date(room.bookingStatus.endDate);
      if (startDate < existingEndDate) {
        return res
          .status(400)
          .json({
            message: `Cannot book before existing booking end date (${
              existingEndDate.toISOString().split("T")[0]
            })`,
          });
      }
    } else {
      if (startDate < currentDate) {
        return res
          .status(400)
          .json({
            message: "Booking must start from the current date or later",
          });
      }
    }

    const maxBookingDays = 30;
    const bookingDuration = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (bookingDuration > maxBookingDays) {
      return res
        .status(400)
        .json({
          message: `Booking duration cannot exceed ${maxBookingDays} days`,
        });
    }

    const existingBooking = await Room.findOne({
      _id: roomId,
      $or: [
        { "bookingStatus.startDate": { $gte: startDate, $lte: endDate } },
        { "bookingStatus.endDate": { $gte: startDate, $lte: endDate } },
      ],
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "Room already booked for selected dates" });
    }

    room.bookingStatus = {
      startDate,
      endDate,
      adults,
      children,
    };

    await room.save();

    res.status(201).json({
      status: 1,
      message: "Booking created successfully",
      room,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  createBooking,
};
