const amqp = require('amqplib');
const { logEmailSent } = require('./database');

const QUEUE_NAME = 'email_queue';

/**
 * Se conecta a RabbitMQ e inicia el proceso de escucha de la cola.
 */
const startConsumer = async () => {
    try {
        const conn = await amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}`);
        const channel = await conn.createChannel();
        
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log(`[RabbitMQ] Esperando mensajes en ${QUEUE_NAME}.`);

        // Consumir mensajes de la cola (Requisito 2)
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                try {
                    const payload = JSON.parse(msg.content.toString());
                    console.log(`[Email Service] Procesando orden para cliente ID: ${payload.clientId}. Tipo: ${payload.emailType}`);
                    
                    // REQUISITO 3: Registrar el log en la DB en lugar de enviar el correo.
                    await logEmailSent(payload.clientId, payload.emailType, payload);
                    
                    console.log(`[Email Service] Log de envío registrado en DB para ID: ${payload.clientId}`);
                    
                    // Se le indica a RabbitMQ que el mensaje fue procesado
                    channel.ack(msg); 
                } catch (error) {
                    console.error('[Email Service] Error al procesar mensaje:', error.message);
                    channel.ack(msg); // ACK para no detener el consumo
                }
            }
        });

    } catch (error) {
        console.error('Error al iniciar el consumidor de RabbitMQ:', error.message);
        // El proceso morirá si no puede conectarse a un servicio vital (DB o RabbitMQ)
    }
};

module.exports = {
    startConsumer
};