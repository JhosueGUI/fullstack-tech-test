// importamos los servicios
const Joi = require('joi');
const { registerNewClient } = require('../services/client.services');

const minAge = 18;
const today = new Date();
// Creamos una fecha que sea exactamente 18 años antes de hoy.
const eighteenYearsAgo = new Date(
    today.getFullYear() - minAge, 
    today.getMonth(), 
    today.getDate()
);
// Convertimos la fecha a formato ISO, que es lo que Joi espera para la comparación.
const maxDateAllowed = eighteenYearsAgo.toISOString().split('T')[0]; 

const registerSchema = Joi.object({
    token: Joi.string().length(8).required(),
    document_type: Joi.string().valid('DNI', 'Carnet de extranjería').required(),
    document_number: Joi.string().min(8).max(12).required(),
    names: Joi.string().max(100).required(),
    last_names: Joi.string().max(100).required(),
    birth_date: Joi.date().iso()
        .max(maxDateAllowed)
        .required()
        .messages({
            'date.max': 'El cliente debe ser mayor de 18 años.',
        }),
        
    phone_number: Joi.string().min(8).max(20).optional(),
    gender: Joi.string().optional()
});
// ANDLER PARA EL ENDPOINT DE CREACIÓN DE CLIENTE

const createClientHandler = async (request, h) => {
    const clientData = request.payload;
    try {
        // Ejecutar la validación del esquema Joi aquí antes de llamar al servicio
        await registerSchema.validateAsync(clientData); 
        
        const result = await registerNewClient(clientData);
        return h.response({ 
            statusCode: 201, 
            message: 'Cliente registrado exitosamente.',
            clientId: result.clientId,
            emailSent: result.emailSent
        }).code(201);
    } catch (error) {
        console.error('Error al procesar registro de cliente:', error.message);
        
        // Manejo de errores de VALIDACIÓN JOI (código 400)
        if (error.isJoi) {
            return h.response({ statusCode: 400, message: error.details[0].message }).code(400);
        }

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