const mongoose = require('mongoose');

// El enlace de tu base de datos fija
const DB_URI = 'mongodb+srv://DvWilkerOFC:dvwilker15@dvwilker15.xndilqb.mongodb.net/wilker_api?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(DB_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;