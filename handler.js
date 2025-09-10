// handler.js - Procesa mensajes y ejecuta plugins

const fs = require('fs');
const path = require('path');

// Cargar todos los plugins de la carpeta ./plugins
function loadPlugins() {
    const plugins = {};
    const pluginFolder = path.join(__dirname, 'plugins');
    
    // Verificar que la carpeta plugins exista
    if (!fs.existsSync(pluginFolder)) {
        console.log('⚠️  Carpeta plugins/ no encontrada. Creando...');
        fs.mkdirSync(pluginFolder);
        return plugins;
    }

    const pluginFiles = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));

    for (const file of pluginFiles) {
        const plugin = require(path.join(pluginFolder, file));
        if (plugin.command && plugin.handler) {
            plugins[plugin.command] = plugin;
            console.log(`✅ Plugin cargado: ${plugin.command}`);
        } else {
            console.warn(`⚠️  Plugin ignorado (faltan propiedades): ${file}`);
        }
    }

    return plugins;
}

// Función principal que maneja cada mensaje
async function handleMessage(sock, message, config) {
    // Evitar procesar mensajes de estado o de otros bots
    if (!message.message) return;
    if (message.key && message.key.remoteJid === 'status@broadcast') return;

    // Extraer el texto del mensaje (soporta varios tipos de mensajes)
    let body = '';
    let from = message.key.remoteJid; // Quién envía el mensaje
    let sender = message.key.participant || from; // Quién es el autor (en grupos)

    // Detectar tipo de mensaje y extraer contenido
    const messageType = Object.keys(message.message)[0];
    const messageContent = message.message[messageType];

    if (messageType === 'conversation') {
        body = messageContent;
    } else if (messageType.includes('Message') && messageContent && messageContent.text) {
        body = messageContent.text;
    } else {
        // Si no es texto, no procesamos (por ahora)
        return;
    }

    // Si el mensaje no empieza con el prefijo, ignorar (a menos que sea modo desarrollo o menaje directo)
    if (!body.startsWith(config.PREFIX)) {
        return;
    }

    // Extraer comando y argumentos
    const args = body.slice(config.PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Cargar plugins (solo la primera vez, o puedes hacerlo al inicio del bot)
    if (!global.plugins) {
        global.plugins = loadPlugins();
    }

    const plugin = global.plugins[commandName];

    if (!plugin) {
        // Comando no encontrado
        await sock.sendMessage(from, { text: `❌ Comando *${commandName}* no encontrado. Usa ${config.PREFIX}help para ver la lista.` });
        return;
    }

    try {
        // Ejecutar el plugin
        await plugin.handler(sock, message, args, {
            from,
            sender,
            config,
            command: commandName
        });
    } catch (error) {
        console.error(`❌ Error ejecutando comando ${commandName}:`, error);
        await sock.sendMessage(from, { text: `⚠️ Error al ejecutar *${commandName}*. El administrador ha sido notificado.` });
    }
}

// Exportar la función para usarla en index.js
module.exports = {
    handleMessage
}; 
