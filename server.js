const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Configurar variables de entorno
dotenv.config();

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json()); // Para que el servidor entienda JSON

// Ruta de prueba para saber que Edward AI está vivo
app.get('/', (req, res) => {
    res.json({ message: "Edward AI Server corriendo perfectamente 🚀" });
});

// Configurar el puerto (Render asigna uno automáticamente, si no usa el 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor de Edward AI activo en el puerto ${PORT}`);
});