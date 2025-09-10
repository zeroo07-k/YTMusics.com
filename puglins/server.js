// server.js - Servidor HTTP simple para monitoreo del bot
// Endpoint: GET /health → responde {"status": "ok", "uptime": ...}

const http = require('http');

function startServer(port = 3000) {
    const server = http.createServer((req, res) => {
        if (req.method === 'GET' && req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'ok',
                uptime: process.uptime(),
                message: 'Bot de WhatsApp activo y funcionando 🤖✅'
            }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Ruta no encontrada. Usa /health para verificar estado.'
            }));
        }
    });

    server.listen(port, () => {
        console.log(`🌐 Servidor de monitoreo corriendo en http://localhost:${port}`);
        console.log(`✅ Usa: GET http://localhost:${port}/health para verificar estado`);
    });

    // Manejar errores del servidor (puerto ocupado, etc.)
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`❌ Puerto ${port} ocupado. Intenta con otro.`);
        } else {
            console.error('❌ Error en servidor HTTP:', err);
        }
    });

    return server;
}

// Exportamos la función para que index.js pueda llamarla
module.exports = startServer;
