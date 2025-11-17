const Joi = require('joi');
const axios = require('axios'); // Para la comunicación con el servicio de seguridad
const { queryDB } = require('./database');
const { getParameterFromRedis } = require('./redis');
const { sendEmailOrder } = require('./rabbitmq');

// Esquema de validación para el registro de clientes
const registerSchema = Joi.object({
    token: Joi.string().length(8).required(),
    document_type: Joi.string().valid('DNI', 'Carnet de extranjería').required(),
    document_number: Joi.string().min(8).max(12).required(),
    names: Joi.string().max(100).required(),
    last_names: Joi.string().max(100).required(),
    birth_date: Joi.date().iso().required(), // Formato ISO: YYYY-MM-DD
    phone_number: Joi.string().min(8).max(20).optional()
});

const routes = [
    {
        method: 'POST',
        path: '/clients',
        options: {
            validate: {
                payload: registerSchema,
                failAction: (request, h, error) => {
                    return h.response({ 
                        statusCode: 400, 
                        message: 'Error de validación de datos del cliente.', 
                        details: error.details 
                    }).code(400).takeover();
                }
            }
        },
        handler: async (request, h) => {
            const clientData = request.payload;
            const securityURL = process.env.SECURITY_SERVICE_URL;

            try {
                // 1. Validar el Token con el Microservicio de Seguridad (Requisito 5)
                const validationResponse = await axios.post(`${securityURL}/validate`, { token: clientData.token });
                
                if (!validationResponse.data.data.valid) {
                     return h.response({ statusCode: 401, message: 'Token de seguridad inválido o no encontrado.' }).code(401);
                }

                // 2. Insertar el cliente en la base de datos (Requisito 5)
                const sql = `
                    INSERT INTO clients (document_type, document_number, names, last_names, birth_date, phone_number)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                const params = [
                    clientData.document_type,
                    clientData.document_number,
                    clientData.names,
                    clientData.last_names,
                    clientData.birth_date,
                    clientData.phone_number
                ];
                const [result] = await queryDB(sql, params);
                const clientId = result.insertId;

                // 3. Consultar Redis para el parámetro de correo (Requisito 3 & 5)
                const emailEnabled = await getParameterFromRedis('EMAIL_ENABLED');
                
                if (emailEnabled === '1') {
                    // 4. Enviar orden de correo a RabbitMQ (Requisito 4 & 5)
                    sendEmailOrder({
                        clientId: clientId,
                        documentNumber: clientData.document_number,
                        names: clientData.names,
                        emailType: 'WELCOME'
                    });
                }
                
                return h.response({ 
                    statusCode: 201, 
                    message: 'Cliente registrado exitosamente.',
                    clientId: clientId,
                    emailSent: emailEnabled === '1'
                }).code(201);

            } catch (error) {
                console.error('Error al procesar registro de cliente:', error.message);
                
                // Manejo de errores específicos (e.g., Duplicado, Conexión a Seguridad)
                if (error.response && error.response.status === 401) {
                    return h.response({ statusCode: 401, message: 'Token de seguridad inválido.' }).code(401);
                }
                if (error.code === 'ER_DUP_ENTRY') {
                    return h.response({ statusCode: 409, message: 'El número de documento ya está registrado.' }).code(409);
                }
                
                return h.response({ statusCode: 500, message: 'Error interno al procesar la solicitud.' }).code(500);
            }
        }
    }
];

module.exports = routes;