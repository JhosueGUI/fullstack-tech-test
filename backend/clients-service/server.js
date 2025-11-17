'use strict';

const Hapi = require('@hapi/hapi');
const { initDB } = require('./database');
const { initRedis } = require('./redis');
const { initRabbitMQ } = require('./rabbitmq');
const routes = require('./routes'); 
require('dotenv').config(); 

const init = async () => {
    // 1. Inicializar todas las integraciones antes de iniciar el servidor
    try {
        await initDB(); 
        await initRedis();
        await initRabbitMQ(); 
    } catch (e) {
        // Si la DB falla (único componente crítico), el proceso debe detenerse.
        console.error("Fallo la inicialización crítica del servicio de Clientes.", e.message);
        process.exit(1);
    }
    
    // 2. Configurar el servidor Hapi
    const server = Hapi.server({
        port: process.env.SERVICE_PORT || 3001,
        host: '0.0.0.0' 
    });

    // 3. Registrar las rutas (aún no creadas, lo haremos en el siguiente paso)
    server.route(routes);

    // 4. Iniciar el servidor
    await server.start();
    console.log(`Microservicio de Clientes corriendo en: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error('Error no manejado en Clientes:', err);
    process.exit(1);
});

init();