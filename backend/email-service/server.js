'use strict';

const { initDB } = require('./database');
const { startConsumer } = require('./emailConsumer');
require('dotenv').config(); 

const init = async () => {
    // 1. Inicializar la conexión a la base de datos
    try {
        await initDB(); 
    } catch (e) {
        // Fallo crítico: la DB debe estar disponible para registrar los logs
        console.error("Fallo la inicialización de la DB para el servicio de Correos.", e.message);
        process.exit(1);
    }
    
    // 2. Iniciar el consumidor de RabbitMQ
    await startConsumer(); 
    
    console.log(`Microservicio de Correos iniciado.`);
};

process.on('unhandledRejection', (err) => {
    console.error('Error no manejado en Correos:', err);
    process.exit(1);
});

init();