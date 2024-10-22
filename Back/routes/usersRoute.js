//Rutas para los usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/api/new-user', userController.saveUser);
router.post('/api/login', userController.login);
router.post('/api/forgot-password', userController.forgotPassword);
router.post('/api/changePass', userController.changePass);
router.get('/api/get-users', userController.getUsers);
router.get('/api/get-user-id/:id', userController.getUserByID);
router.post('/api/edit-user/:id', userController.editUser)
router.delete('/api/delete-user/:id', userController.deleteUser);

module.exports = router;