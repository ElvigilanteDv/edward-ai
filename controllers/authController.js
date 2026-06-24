const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Función auxiliar para generar los tokens de sesión (JWT)
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // El token dura 30 días activado
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // 1. Revisar si el usuario ya existe en la base de datos
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El usuario ya existe con ese correo' });
        }

        // 2. Crear el nuevo usuario si todo está bien
        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id) // Le mandamos su llave de entrada
            });
        } else {
            res.status(400).json({ message: 'Datos de usuario inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// @desc    Autenticar usuario y obtener token (Login)
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar si el usuario existe por correo
        const user = await User.findOne({ email });

        // 2. Si existe, comparar si la contraseña coincide usando el método de nuestro Modelo
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id) // Iniciamos su sesión
            });
        } else {
            res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};
