const mysql = require('mysql2/promise');

let pool;

/**
 * Inicializa el pool de conexiones a MySQL con lógica de reintento.
 * Espera a que la base de datos esté lista y crea la tabla 'tokens'.
 * @param {number} retries - Número máximo de intentos de conexión.
 */
const initDB = async (retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            // 1. Crear el Pool de Conexiones
            pool = mysql.createPool({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                waitForConnections: true,
                connectionLimit: 10,
            });
            
            // 2. Probar la conexión (adquirir y liberar una conexión)
            const connection = await pool.getConnection(); 
            connection.release(); // Libera la conexión para que otros la usen

            // 3. Creación de la tabla de tokens (si no existe)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    token VARCHAR(8) NOT NULL UNIQUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);
            
            console.log("Conexión a la base de datos de Seguridad establecida y tabla verificada.");
            return; // 🎉 Éxito: Salir de la función y del bucle

        } catch (error) {
            // Manejo de fallos en la conexión o creación de tabla
            if (i < retries - 1) {
                console.warn(`Error de conexión a DB. Reintentando en 5 segundos... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
            } else {
                // Si es el último intento y falla, lanzar el error final
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