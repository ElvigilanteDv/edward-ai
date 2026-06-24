const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Protegemos la ruta del chat con el middleware 'protect'
// Así, solo los usuarios logueados pueden hablar con Edward AI
router.post('/', protect, sendMessage);

module.exports = router;
