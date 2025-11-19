
'use strict';

// Importaciones de las nuevas ubicaciones
const { initDB } = require('./database/mysql');
const { createLogTable } = require('./models/emailLog.model');
const { startConsumer } = require('./consumer/emailConsumer');

require('dotenv').config(); 

const init = async () => {
    // 1. Inicializar la conexión a la base de datos y la tabla de logs
    try {
        await initDB(); 
        await createLogTable();
    } catch (e) {
        // Fallo crítico: la DB debe estar disponible para registrar los logs
        console.error("Fallo la inicialización crítica de la DB para el servicio de Correos.", e.message);
        process.exit(1);
    }
    
    // 2. Iniciar el consumidor de RabbitMQ
    try {
        await startConsumer(); 
    } catch (e) {
        // Si RabbitMQ falla, el servicio es inútil, el proceso debe morir
        console.error("Fallo la inicialización crítica del Consumidor de RabbitMQ.", e.message);
        process.exit(1);
    }
    
    console.log(`Microservicio de Correos iniciado.`);
};

process.on('unhandledRejection', (err) => {
    console.error('Error no manejado en Correos:', err);
    process.exit(1);
});

init();