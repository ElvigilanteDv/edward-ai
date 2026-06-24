const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 1. Cargar variables de entorno
dotenv.config();

// 2. Conectar a la Base de Datos MongoDB
connectDB();

const app = express();

// 3. Middlewares globales
app.use(cors());
app.use(express.json());

// 4. Conectar las Rutas de la aplicación
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Ruta base de prueba para verificar el estado en Render
app.get('/', (req, res) => {
    res.json({ message: "Edward AI Server corriendo perfectamente y conectado a la BD 🚀" });
});

// 5. Configurar el puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor de Edward AI activo en el puerto ${PORT}`);
});