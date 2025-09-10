// config.js - Configuración global del bot

module.exports = {
    // Prefijo para comandos (ej: !ping, ?help, $menu)
    PREFIX: '!',

    // ¿Mostrar logs de depuración? (true/false)
    DEBUG: false,

    // ¿Mostrar QR en consola? (normalmente true, a menos que ya estés autenticado)
    SHOW_QR: true,

    // ¿Iniciar servidor HTTP en /health? (opcional, para monitoreo)
    USE_SERVER: false,
    PORT: 3000, // Puerto del servidor (si USE_SERVER es true)

    // Número del dueño (opcional, para comandos privados)
    // Formato: '521234567890@s.whatsapp.net' (reemplaza 52 por tu código de país y el número)
    OWNER_NUMBER: '',

    // Nombre del bot (opcional, para respuestas personalizadas)
    BOT_NAME: 'MiBotMD',

    // ¿Responder solo en chats privados? (true = solo privados, false = también en grupos)
    PRIVATE_ONLY: false,

    // ¿Permitir comandos en grupos?
    ALLOW_IN_GROUPS: true
}; 
