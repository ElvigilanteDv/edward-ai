const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// 1. Conectar a la Base de Datos MongoDB Atlas
connectDB();

const app = express();

// 2. Middlewares globales
app.use(cors());
app.use(express.json());

// 3. Hacer que la carpeta 'public' sea accesible desde internet
app.use(express.static(path.join(__dirname, 'public')));

// 4. Conectar las Rutas de la aplicación (APIs)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// 5. Redirigir cualquier otra ruta a la página principal del chat
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 6. Configurar el puerto del servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor de Edward AI activo en el puerto ${PORT}`);
});