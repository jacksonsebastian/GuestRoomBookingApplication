const express = require('express');
const router = express.Router();

const authenticate = require('../models/authenticate');
const userController = require('../controllers/userControllers');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/userValidation');

router.post('/register', validate(userValidation.register), userController.registerUser);
router.post('/login', validate(userValidation.login), userController.login);
router.get('/',authenticate, userController.getUsers);
router.get('/:id',authenticate, userController.getUserById);
router.put('/:id',authenticate, validate(userValidation.update), userController.updateUser);
router.delete('/:id',authenticate, userController.deleteUser);

module.exports = router;
