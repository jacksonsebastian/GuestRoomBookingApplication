const express = require('express');
const router = express.Router();

const authenticate = require('../models/authenticate');
const roomController = require('../controllers/roomControllers');
const validate = require('../middlewares/validate');
const roomValidation = require('../validations/roomValidation');

// Create a new room
// router.post('/create',authenticate, validate(roomController.createRoom), roomController.createRoom);
router.post('/create', validate(roomValidation.create), roomController.createRoom);

// Get all rooms
router.post('/details', roomController.getAllRooms);

// Get room by ID
router.post('/detailById',validate(roomValidation.getById), roomController.getRoomById);

// Update room by ID
router.put('/update',  validate(roomValidation.update), roomController.updateRoom);

// Delete room by ID
router.delete('/delete', authenticate, validate(roomValidation.delete), roomController.deleteRoom);

module.exports = router;
