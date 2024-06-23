const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/userValidation');

router.post('/register', validate(userValidation.register), userController.registerUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validate(userValidation.update), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
