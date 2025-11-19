// src/third-party/rabbitmq.js
// Maneja la conexión y el envío de mensajes a RabbitMQ

const amqp = require('amqplib');

let channel;
const QUEUE_NAME = 'email_queue';

//Conecta al message broker y crea el canal de comunicación.

const initRabbitMQ = async () => {
    const amqpUrl = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`;

    while (true) {
        try {
            const conn = await amqp.connect(amqpUrl);
            channel = await conn.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            console.log("Conexión a RabbitMQ establecida y cola de correo verificada.");
            break;

        } catch (error) {
            console.error("RabbitMQ no disponible, reintentando en 5s...");
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};


//Envía un mensaje a la cola de correos.
const sendEmailOrder = (messageData) => {
    if (!channel) {
        console.warn("RabbitMQ no está conectado. El mensaje de correo no fue enviado.");
        return false;
    }
    
    try {
        const msg = Buffer.from(JSON.stringify(messageData));
        channel.sendToQueue(QUEUE_NAME, msg, { persistent: true });
        console.log(`[RabbitMQ] Orden de correo enviada para el cliente ID: ${messageData.clientId}`);
        return true;
    } catch (error) {
        console.error('Error al enviar mensaje a RabbitMQ:', error.message);
        return false;
    }
};

module.exports = {
    initRabbitMQ,
    sendEmailOrder
};