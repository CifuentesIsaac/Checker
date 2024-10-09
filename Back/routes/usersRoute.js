//Rutas para los usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/api/new-user', userController.saveUser);
router.post('/api/login', userController.login);

module.exports = router;