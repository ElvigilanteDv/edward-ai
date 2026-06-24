const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Usamos una clave secreta fija en el código para desencriptar la sesión
            const decoded = jwt.verify(token, 'EdwardAI_ClaveSecreta_12345');

            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, el token falló o expiró' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se proporcionó ningún token' });
    }
};

module.exports = { protect };