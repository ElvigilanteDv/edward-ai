const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Ruta para registrarse: vincula el POST a la función del controlador
router.post('/register', registerUser);

// Ruta para iniciar sesión: vincula el POST a la función del controlador
router.post('/login', loginUser);

module.exports = router;
