const amqp = require('amqplib');

let channel;
const QUEUE_NAME = 'email_queue';

/**
 * Conecta al message broker y crea el canal de comunicación.
 */
const initRabbitMQ = async () => {
    try {
        const conn = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`);
        channel = await conn.createChannel();
        
        // Aseguramos que la cola exista (durable: true)
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("Conexión a RabbitMQ establecida y cola de correo verificada.");
    } catch (error) {
        console.error('Error al conectar con RabbitMQ:', error.message);
        // Si RabbitMQ falla, permitimos que el servicio arranque pero sin funcionalidad de cola.
        // En producción se podría implementar un reintento.
    }
};

/**
 * Envía un mensaje a la cola de correos para que el Microservicio de Correos lo procese.
 * @param {object} messageData - Datos del mensaje (e.g., clienteId, emailType).
 */
const sendEmailOrder = (messageData) => {
    if (!channel) {
        console.warn("RabbitMQ no está conectado. El mensaje de correo no fue enviado.");
        return false;
    }
    
    try {
        const msg = Buffer.from(JSON.stringify(messageData));
        // persistent: true indica que el mensaje debe guardarse en disco
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