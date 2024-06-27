const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  floorSize: {
    type: Number,
    required: true
  },
  numberOfBeds: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  minBookingPeriod: {
    type: Number,
    required: true
  },
  maxBookingPeriod: {
    type: Number,
    required: true
  },
  rentAmount: {
    type: Number,
    required: true
  },
  bookingStatus: {
    startDate: { type: Date },
    endDate: { type: Date },
    adults: { type: Number },
    children: { type: Number, default: 0 },
  },
}, { timestamps: true });

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
