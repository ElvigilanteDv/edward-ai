// VARIABLES DE ESTADO LOCAL
let chats = JSON.parse(localStorage.getItem('edward_chats')) || [
    { id: 'default', title: 'Chat Predeterminado', messages: [{ role: 'system', content: 'Bienvenido a Edward AI. ¿Qué vamos a desarrollar hoy?' }] }
];
let activeChatId = localStorage.getItem('edward_active_chat') || 'default';
let selectedFileBase64 = null;

// ELEMENTOS DEL DOM
const chatsList = document.getElementById('chats-list');
const currentChatTitle = document.getElementById('current-chat-title');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const newChatBtn = document.getElementById('new-chat-btn');
const fileInput = document.getElementById('file-input');
const filePreviewContainer = document.getElementById('file-preview-container');

// 1. RENDERIZAR LA LISTA DE CHATS EN LA BARRA LATERAL
function renderSidebar() {
    chatsList.innerHTML = '';
    chats.forEach(chat => {
        const tab = document.createElement('div');
        tab.classList.add('chat-tab');
        if (chat.id === activeChatId) tab.classList.add('active');
        tab.textContent = chat.title;
        
        // Evento para cambiar de chat al hacer click
        tab.addEventListener('click', () => {
            activeChatId = chat.id;
            localStorage.setItem('edward_active_chat', activeChatId);
            renderSidebar();
            renderMessages();
        });
        chatsList.appendChild(tab);
    });
}

// 2. RENDERIZAR LOS MENSAJES DEL CHAT ACTIVO
function renderMessages() {
    chatMessages.innerHTML = '';
    const activeChat = chats.find(c => c.id === activeChatId) || chats[0];
    currentChatTitle.textContent = activeChat.title;

    activeChat.messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message');
        msgDiv.classList.add(msg.role === 'user' ? 'user-message' : 'system-message');
        
        // Si el mensaje incluye una imagen adjunta, la renderizamos
        if (msg.image) {
            const img = document.createElement('img');
            img.src = msg.image;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '8px';
            img.style.marginBottom = '8px';
            img.style.display = 'block';
            msgDiv.appendChild(img);
        }

        const textSpan = document.createElement('span');
        textSpan.textContent = msg.content;
        msgDiv.appendChild(textSpan);
        
        chatMessages.appendChild(msgDiv);
    });
    
    // Auto-scroll hacia abajo de todo
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 3. CREAR UN NUEVO CHAT
newChatBtn.addEventListener('click', () => {
    const numChats = chats.length + 1;
    const newId = 'chat_' + Date.now();
    const newChat = {
        id: newId,
        title: `Conversación #${numChats}`,
        messages: [{ role: 'system', content: 'Nuevo espacio de chat iniciado. ¿En qué te ayudo, Edward?' }]
    };
    
    chats.push(newChat);
    activeChatId = newId;
    saveToLocalStorage();
    renderSidebar();
    renderMessages();
});

// 4. MANEJAR CARGA Y PREVISUALIZACIÓN DE FOTOS
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        selectedFileBase64 = event.target.result;
        // Mostrar vista previa flotante abajo
        filePreviewContainer.innerHTML = `
            <img src="${selectedFileBase64}" alt="Preview">
            <span style="cursor:pointer; color:#ef4444; font-weight:bold;" id="clear-file">✕</span>
        `;
        filePreviewContainer.classList.remove('hidden');

        document.getElementById('clear-file').addEventListener('click', () => {
            selectedFileBase64 = null;
            filePreviewContainer.classList.add('hidden');
            fileInput.value = '';
        });
    };
    reader.readAsDataURL(file);
});

// 5. ENVIAR MENSAJE AL BACKEND
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text && !selectedFileBase64) return;

    const activeChat = chats.find(c => c.id === activeChatId);

    // Guardar el mensaje del usuario de manera local en el historial
    const userMessage = { role: 'user', content: text };
    if (selectedFileBase64) {
        userMessage.image = selectedFileBase64;
    }
    activeChat.messages.push(userMessage);
    renderMessages();
    
    // Limpiar inputs y previsualizaciones al instante
    chatInput.value = '';
    selectedFileBase64 = null;
    filePreviewContainer.classList.add('hidden');
    fileInput.value = '';

    try {
        const token = localStorage.getItem('token');
        // Llamada a nuestro servidor de Render
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();
        
        if (res.ok) {
            // Guardamos la respuesta que vino del backend (Groq)
            activeChat.messages.push({ role: 'assistant', content: data.edwardAI });
        } else {
            activeChat.messages.push({ role: 'system', content: `Error: ${data.message || 'No se pudo procesar'}` });
        }
    } catch (err) {
        activeChat.messages.push({ role: 'system', content: 'Error crítico de conexión con el backend.' });
    }

    saveToLocalStorage();
    renderMessages();
});

function saveToLocalStorage() {
    localStorage.setItem('edward_chats', JSON.stringify(chats));
    localStorage.setItem('edward_active_chat', activeChatId);
}

// INICIALIZACIÓN DE LA INTERFAZ
renderSidebar();
renderMessages();