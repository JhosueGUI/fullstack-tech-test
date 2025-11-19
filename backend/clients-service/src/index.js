'use strick'

const Hapi = require('@hapi/hapi');

//importamos las funciones
const { initDB } = require('./database/mysql');
const { initRedis } = require('./third-party/redis');
const { initRabbitMQ } = require('./third-party/rabbitmq');
const { createTable } = require('./models/client.model');
const clientRoutes = require('./routes/client.routes');

//iniciamos
const init = async () => {
    try {
        //inicializamos la conexion a la base de datos
        await initDB();
        //inicializamos la creacion de db
        await createTable();
        //inicializar servicios no críticos
        await initRedis();
        await initRabbitMQ();
    } catch (e) {
        console.error("Fallo la inicialización crítica del servicio de Clientes.", e.message);
        process.exit(1);
    }
    //configuramos el servidor
    const server = Hapi.server({
        port: process.env.SERVICE_PORT || 3001,
        host: '0.0.0.0'
    });

    //registramos las rutas
    server.route(clientRoutes);

    //iniciamos el servidor
    await server.start();
    console.log(`Microservicio de Clientes corriendo en: ${server.info.uri}`);
};

//Manejamos errores no controlados
process.on('unhandledRejection', (err) => {
    console.error('Error no manejado en Clientes:', err);
    process.exit(1);
});

//llamamos a la funcion init
init();
