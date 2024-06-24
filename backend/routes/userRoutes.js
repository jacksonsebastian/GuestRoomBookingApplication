const express = require('express');
const router = express.Router();

const authenticate = require('../models/authenticate');
const userController = require('../controllers/userControllers');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/userValidation');

// create User
router.post('/create',authenticate, validate(userValidation.create), userController.createUser);

// get all users
router.get('/details',authenticate, userController.getUsers);

// get user by id
router.post('/detailById',authenticate, userController.getUserById);

// update user by id
router.put('/update',authenticate, validate(userValidation.update), userController.updateUser);

// delete user by id
router.delete('/delete',authenticate, userController.deleteUser);

module.exports = router;
