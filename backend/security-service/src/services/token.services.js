// src/services/token.service.js

const { generateToken } = require('../utils/generateToken');
const { insertToken, findToken } = require('../models/token.model');

/**
 * Genera un nuevo token y lo registra en la base de datos.
 * @returns {Promise<string>} El token generado.
 */
const createAndRegisterToken = async () => {
    const token = generateToken();
    // 1. Intentar insertar en la DB (Modelo)
    await insertToken(token);
    // 2. Devolver solo el token
    return token;
};

/**
 * Valida un token verificando su existencia en la base de datos.
 * @param {string} token - El token a validar.
 * @returns {Promise<boolean>} True si es válido, False si no existe.
 */
const validateToken = async (token) => {
    // 1. Buscar en la DB (Modelo)
    const isValid = await findToken(token);
    // 2. Devolver el resultado de la validación
    return isValid;
};

module.exports = {
    createAndRegisterToken,
    validateToken
};