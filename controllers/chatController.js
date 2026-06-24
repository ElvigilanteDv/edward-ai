const { Groq } = require('groq-sdk');

// @desc    Enviar un mensaje a Edward AI y obtener respuesta de Groq
// @route   POST /api/chat
// @access  Privado (Requiere token)
exports.sendMessage = async (req, res) => {
    const { message } = req.body;

    // Verificar que el usuario haya escrito algo
    if (!message) {
        return res.status(400).json({ message: 'Por favor, escribe un mensaje' });
    }

    try {
        // Tu API Key fija directamente puesta en el código
        const groq = new Groq({
            apiKey: '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'
        });

        // Hacer la petición a Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Eres Edward AI, una inteligencia artificial avanzada, potente, imponente y con una personalidad genial. Fuiste creado por Edward. Responde de forma concisa, inteligente y con confianza.'
                },
                {
                    role: 'user',
                    content: message
                }
            ],
            model: 'llama3-8b-8192',
            temperature: 0.7
        });

        // Extraer la respuesta de texto que generó la IA
        const aiResponse = chatCompletion.choices[0]?.message?.content || 'No pude procesar el mensaje';

        // Devolver la respuesta al usuario junto con su nombre
        res.json({
            user: req.user.name,
            edwardAI: aiResponse
        });

    } catch (error) {
        console.error('Error en Groq API:', error);
        res.status(500).json({ message: 'Error al conectar con el motor de IA', error: error.message });
    }
};
