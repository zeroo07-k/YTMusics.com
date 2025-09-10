// plugins/ping.js - Plugin de ejemplo: responde "¡Pong! 🏓" al comando !ping

module.exports = {
    command: 'ping', // El comando será: !ping (según el prefijo en config.js)
    handler: async (sock, message, args, context) => {
        const { from } = context;
        await sock.sendMessage(from, { text: '¡Pong! 🏓' });
    }
};
