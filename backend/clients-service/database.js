const mysql = require('mysql2/promise');
let pool;
const initDB = async (retries = 5) => {
    const config= {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
    };
    for (let i = 0; i < retries; i++) {
        try {
            pool = mysql.createPool(config);
            const connection = await pool.getConnection();
            connection.release();
            console.log("Conexión a la base de datos de Clientes establecida.");
            // 1. Crear tabla de clientes
            await pool.query(`
                CREATE TABLE IF NOT EXISTS clients (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    document_type VARCHAR(50) NOT NULL,
                    document_number VARCHAR(50) NOT NULL UNIQUE,
                    names VARCHAR(100) NOT NULL,
                    last_names VARCHAR(100) NOT NULL,
                    birth_date DATE NOT NULL,
                    phone_number VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
            `);

            // 2. Crear tabla de parámetros globales
            await pool.query(`
                CREATE TABLE IF NOT EXISTS global_parameters (
                    name VARCHAR(50) PRIMARY KEY,
                    value VARCHAR(255) NOT NULL,
                    description VARCHAR(255)
                );
            `);

            // 3. Insertar el parámetro inicial (si no existe): EMAIL_ENABLED
            // El valor '1' significa activo, '0' significa inactivo.
            await pool.query(`
                INSERT IGNORE INTO global_parameters (name, value, description) 
                VALUES ('EMAIL_ENABLED', '1', 'Habilita o deshabilita el envío de correos de bienvenida (1=activo, 0=inactivo).');
            `);
            
            console.log("Tablas de Clientes y Parámetros verificadas.");
            return; // Éxito total
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
const getGlobalParameters = async () => {
    const [rows] = await pool.execute('SELECT name, value FROM global_parameters');
    return rows;
};

const queryDB = (sql, params) => {
    if (!pool) throw new Error("Pool de base de datos no inicializado.");
    return pool.execute(sql, params);
};

module.exports = {
    initDB,
    queryDB,
    getGlobalParameters
};