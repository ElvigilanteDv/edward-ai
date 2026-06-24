const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor, añade un nombre']
    },
    email: {
        type: String,
        required: [true, 'Por favor, añade un correo'],
        unique: true, // No permite que se registren dos veces con el mismo correo
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor, añade un correo válido'
        ]
    },
    password: {
        type: String,
        required: [true, 'Por favor, añade una contraseña'],
        minlength: 6 // Mínimo 6 caracteres por seguridad
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Este código encripta la contraseña automáticamente antes de guardarla en la base de datos
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para verificar si la contraseña que mete el usuario coincide con la guardada
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
