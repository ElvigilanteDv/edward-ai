const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Los tokens se mandan en los Headers como 'Bearer token_aqui'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Obtener el token del string
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar que el token sea real y no esté alterado usando la firma secreta
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Buscar al usuario dueño de ese token en la base de datos (sin traer la contraseña)
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Si todo está bien, dejamos que la petición continúe al chat
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'No autorizado, el token falló o expiró' });
        }
    }

    // Si no mandaron ningún token en los Headers
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no se proporcionó ningún token' });
    }
};

module.exports = { protect };
