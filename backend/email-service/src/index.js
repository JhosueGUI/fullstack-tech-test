
'use strict';

// Importaciones de las nuevas ubicaciones
const { initDB } = require('./database/mysql');
const { createLogTable } = require('./models/emailLog.model');
const { startConsumer } = require('./consumer/emailConsumer');

require('dotenv').config(); 

const init = async () => {
    //Inicializar la conexión a la base de datos y la tabla de logs
    try {
        await initDB(); 
        await createLogTable();
    } catch (e) {
        console.error("Fallo la inicialización crítica de la DB para el servicio de Correos.", e.message);
        process.exit(1);
    }
    
    //Iniciar el consumidor de RabbitMQ
    try {
        await startConsumer(); 
    } catch (e) {
        console.error("Fallo la inicialización crítica del Consumidor de RabbitMQ.", e.message);
        process.exit(1);
    }
    
    console.log(`Microservicio de Correos iniciado.`);
};

//Manejo de errores no controlados
process.on('unhandledRejection', (err) => {
    console.error('Error no manejado en Correos:', err);
    process.exit(1);
});

init();