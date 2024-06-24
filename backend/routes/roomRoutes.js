const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomControllers');

// Create a new room
router.post('/', roomController.createRoom);

// Get all rooms
router.get('/', roomController.getAllRooms);

// Get room by ID
router.get('/:id', roomController.getRoomById);

// Update room by ID
router.put('/:id', roomController.updateRoom);

// Delete room by ID
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
