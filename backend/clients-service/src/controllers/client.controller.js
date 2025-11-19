
//importamos los servicios
const Joi = require('joi');
const { registerNewClient } = require('../services/client.services');

//validamos
const registerSchema = Joi.object({
    token: Joi.string().length(8).required(),
    document_type: Joi.string().valid('DNI', 'Carnet de extranjería').required(),
    document_number: Joi.string().min(8).max(12).required(),
    names: Joi.string().max(100).required(),
    last_names: Joi.string().max(100).required(),
    birth_date: Joi.date().iso().required(), // Formato ISO: YYYY-MM-DD
    phone_number: Joi.string().min(8).max(20).optional()
});
//handle para el endpoint de creación de cliente (POST /clients)
const createClientHandler = async (request, h) => {
    const clientData = request.payload;
    try {
        const result = await registerNewClient(clientData);
        return h.response({ 
            statusCode: 201, 
            message: 'Cliente registrado exitosamente.',
            clientId: result.clientId,
            emailSent: result.emailSent
        }).code(201);
    } catch (error) {
        console.error('Error al procesar registro de cliente:', error.message);
        
        // Manejo de errores especializados del Servicio
        if (error.isAuthError || (error.response && error.response.status === 401)) {
            return h.response({ statusCode: 401, message: 'Token de seguridad inválido.' }).code(401);
        }

        // Manejo de error de documento duplicado (MySQL code ER_DUP_ENTRY)
        if (error.code === 'ER_DUP_ENTRY') {
            return h.response({ statusCode: 409, message: 'El número de documento ya está registrado.' }).code(409);
        }

        // Error interno
        return h.response({ statusCode: 500, message: 'Error interno al procesar la solicitud.' }).code(500);
    }
}
module.exports = {
    createClientHandler,
    registerSchema
};