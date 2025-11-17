// /backend/security-service/server.js

'use strict';

const Hapi = require('@hapi/hapi');
const { initDB, queryDB } = require('./database'); // Implementaremos esto en el siguiente paso
const routes = require('./routes'); // Implementaremos esto después

const init = async () => {
    // 1. Configurar el servidor
    const server = Hapi.server({
        port: process.env.SERVICE_PORT || 3000,
        host: '0.0.0.0'
    });

    // 2. Inicializar la conexión a la base de datos
    await initDB(); 

    // 3. Registrar las rutas (endpoints)
    server.route(routes);

    // 4. Iniciar el servidor
    await server.start();
    console.log(`Microservicio de Seguridad corriendo en: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();