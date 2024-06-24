const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/userValidation');

// Auth
router.post('/register', validate(userValidation.register), authController.registerUser);
router.post('/login', validate(userValidation.login), authController.login);

module.exports = router;