const axios = require('axios');

//importamos el modelo
const { insertClient } = require('../models/client.model');
const { getParameterFromRedis } = require('../third-party/redis');
const { sendEmailOrder } = require('../third-party/rabbitmq')

const registerNewClient = async (clientData) => {
    //validar el token con el microservicio de seguridad
    const validationResponse = await axios.post(`${process.env.SECURITY_SERVICE_URL}/validate`, { token: clientData.token });
   
    //verificar la respuesta
    if (!validationResponse.data?.data?.valid) {
        const error = new Error('Token de seguridad inválido o no encontrado.');
        error.isAuthError = true; 
        throw error;
    }

    //Insertar el cliente en la base de datos
    const clientId = await insertClient(clientData);
    console.log(`Nuevo cliente registrado con ID: ${clientId}`);

    //Consultar Redis para el parámetro de correo
    const emailEnabled = await getParameterFromRedis('EMAIL_ENABLED');
    let emailSent = false;

    if (emailEnabled === '1') {
        //Enviar orden de correo a RabbitMQ
        sendEmailOrder({
            clientId: clientId,
            documentNumber: clientData.document_number,
            names: clientData.names,
            emailType: 'Bienvenido'
        });
        emailSent = true;
    }
    console.log(`Parámetro EMAIL_ENABLED: ${emailEnabled}, Correo enviado: ${emailSent}`);

    return { 
        clientId, 
        emailSent 
    };
    
}
module.exports = {
    registerNewClient
};