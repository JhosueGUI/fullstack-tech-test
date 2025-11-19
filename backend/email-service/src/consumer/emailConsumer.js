// Maneja la conexión y el consumo de la cola de RabbitMQ
const amqp = require('amqplib');
// Importar la función del modelo
const { logEmailSent } = require('../models/emailLog.model'); 

const QUEUE_NAME = 'email_queue';

//Se conecta a RabbitMQ e inicia el proceso de escucha de la cola.
const startConsumer = async () => {
    const amqpUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`;

    let conn, channel;
    // Lógica de reintento para la conexión a RabbitMQ
    while (true) {
        try {
            conn = await amqp.connect(amqpUrl);
            channel = await conn.createChannel();

            await channel.assertQueue(QUEUE_NAME, { durable: true });

            console.log(`[RabbitMQ] Conectado. Esperando mensajes en ${QUEUE_NAME}.`);
            break;

        } catch (error) {
            console.error("RabbitMQ no disponible, reintentando en 5s...");
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    // Configurar el consumidor
    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        try {
            const payload = JSON.parse(msg.content.toString());

            await logEmailSent(payload.clientId, payload.emailType, payload);

            channel.ack(msg);
        } catch (err) {
            console.error("Error procesando mensaje:", err.message);
            channel.ack(msg);
        }
    });
};


module.exports = {
    startConsumer
};