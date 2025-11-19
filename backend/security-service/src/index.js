// src/index.js (reemplaza a tu anterior server.js)

'use strict';

const Hapi = require('@hapi/hapi');
// Importa las funciones de inicio desde sus nuevas ubicaciones
const { initDB } = require('./database/mysql'); 
const { createTable } = require('./models/token.model');
const tokenRoutes = require('./routes/token.routes'); 

const init = async () => {
    // 1. Configurar el servidor
    const server = Hapi.server({
        port: process.env.SERVICE_PORT || 3000,
        host: '0.0.0.0'
    });

    // 2. Inicializar la conexión a la base de datos y verificar tabla
    await initDB(); 
    await createTable(); // <--- Ahora hacemos esto después de la conexión

    // 3. Registrar las rutas (endpoints)
    server.route(tokenRoutes); // Usamos el array de rutas importado

    // 4. Iniciar el servidor
    await server.start();
    console.log(`Microservicio de Seguridad corriendo en: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log("Error no manejado:", err);
    process.exit(1);
});

init();