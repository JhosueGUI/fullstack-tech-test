
'use strict';

const Hapi = require('@hapi/hapi');
// Importa las funciones de inicio desde sus nuevas ubicaciones
const { initDB } = require('./database/mysql');
const { createTable } = require('./models/token.model');
const tokenRoutes = require('./routes/token.routes');

const init = async () => {
    try {
        await initDB();
        await createTable();
    } catch (e) {
        console.error("Fallo la inicialización crítica del servicio de Seguridad.", e.message);
        process.exit(1);
    }
    // Configurar el servidor
    const server = Hapi.server({
        port: process.env.SERVICE_PORT || 3000,
        host: '0.0.0.0'
    });


    // Registrar las rutas (endpoints)
    server.route(tokenRoutes);

    // Iniciar el servidor
    await server.start();
    console.log(`Microservicio de Seguridad corriendo en: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log("Error no manejado:", err);
    process.exit(1);
});

init();