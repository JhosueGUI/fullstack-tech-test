// src/models/token.model.js

// Importar la función de consulta desde la nueva ubicación
const { queryDB } = require('../database/mysql'); 

/**
 * Verifica y crea la tabla 'tokens' si no existe.
 */
const createTable = async () => {
    await queryDB(`
        CREATE TABLE IF NOT EXISTS tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            token VARCHAR(8) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
    console.log("Tabla 'tokens' verificada.");
};

/**
 * Inserta un token en la base de datos.
 * @param {string} token - El token a insertar.
 */
const insertToken = async (token) => {
    // Usar la función de consulta para la inserción
    const [result] = await queryDB('INSERT INTO tokens (token) VALUES (?)', [token]);
    return result.insertId;
};

/**
 * Busca un token en la base de datos.
 * @param {string} token - El token a buscar.
 * @returns {Promise<boolean>} Devuelve true si el token existe.
 */
const findToken = async (token) => {
    // Usar la función de consulta para la búsqueda
    const [rows] = await queryDB('SELECT token FROM tokens WHERE token = ?', [token]);
    // El resultado es un array, si tiene elementos (rows.length > 0) el token existe.
    return rows.length > 0;
};

module.exports = {
    createTable,
    insertToken,
    findToken,
};