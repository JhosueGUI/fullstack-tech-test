// src/database/mysql.js

const mysql = require('mysql2/promise');

let pool;

/**
 * Inicializa el pool de conexiones a MySQL con lógica de reintento.
 * @param {number} retries - Número máximo de intentos de conexión.
 */
const initDB = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
            });
            
            const connection = await pool.getConnection(); 
            connection.release();
            
            console.log("Conexión a la base de datos de Seguridad establecida.");
            return;
        } catch (error) {
            if (i < retries - 1) {
                console.warn(`Error de conexión a DB. Reintentando en 5 segundos... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('Error final de conexión a DB:', error.message);
                throw new Error("Fallo la conexión a la base de datos después de varios reintentos.");
            }
        }
    }
};

/**
 * Función de utilidad para ejecutar consultas usando el pool.
 * @param {string} sql - La consulta SQL.
 * @param {Array<any>} params - Los parámetros para la consulta.
 * @returns {Promise<[Array<any>, any]>} El resultado de la consulta.
 */
const queryDB = (sql, params) => {
    if (!pool) {
        throw new Error("Pool de base de datos no inicializado.");
    }
    return pool.execute(sql, params);
};

module.exports = {
    initDB,
    queryDB
};