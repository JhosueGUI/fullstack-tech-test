// src/controllers/token.controller.js

const { createAndRegisterToken, validateToken } = require('../services/token.services');

//Handler para el endpoint de generación de token (GET /token).
const createTokenHandler = async (request, h) => {
    try {
        const token = await createAndRegisterToken();
        
        return h.response({ 
            statusCode: 200, 
            message: 'Token generado exitosamente', 
            data: { token } 
        }).code(200);

    } catch (error) {
        console.error('Error en createTokenHandler:', error);
        return h.response({ 
            statusCode: 500, 
            message: 'Error interno del servidor al generar token' 
        }).code(500);
    }
};

//Handler para el endpoint de validación de token (POST /validate).

const validateTokenHandler = async (request, h) => {
    const { token } = request.payload;

    if (!token || typeof token !== 'string' || token.length !== 8) {
        return h.response({ 
            statusCode: 400, 
            message: 'Token inválido o faltante' 
        }).code(400);
    }

    try {
        const isValid = await validateToken(token.toUpperCase()); 
        if (isValid) {
            return h.response({ 
                statusCode: 200, 
                message: 'Token válido',
                data: { valid: true }
            }).code(200);
        } else {
            return h.response({ 
                statusCode: 401, 
                message: 'Token inválido o no encontrado',
                data: { valid: false }
            }).code(401);
        }

    } catch (error) {
        console.error('Error en validateTokenHandler:', error);
        return h.response({ 
            statusCode: 500, 
            message: 'Error interno del servidor al validar token'
        }).code(500);
    }
};

module.exports = {
    createTokenHandler,
    validateTokenHandler
};