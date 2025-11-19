// src/utils/generateToken.js

/**
 * Función para generar un token alfanumérico aleatorio de 8 caracteres.
 */
const generateToken = () => {
    // Lógica para generar un token alfanumérico aleatorio de 8 caracteres
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

module.exports = {
    generateToken
};