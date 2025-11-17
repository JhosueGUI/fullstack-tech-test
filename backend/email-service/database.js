const mysql = require('mysql2/promise');

let pool;

/**
 * Inicializa la DB y crea la tabla de logs de correos.
 */
const initDB = async (retries = 5) => {
    const config = {
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

            // 1. Crear tabla de logs de correos (Requisito 1)
            await pool.query(`
                CREATE TABLE IF NOT EXISTS email_logs (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    client_id INT NOT NULL,
                    email_type VARCHAR(50) NOT NULL,
                    status VARCHAR(50) NOT NULL,
                    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    message_payload JSON 
                );
            `);
            
            console.log("Conexión a DB de Clientes y tabla 'email_logs' verificadas.");
            return; 
        } catch (error) {
            if (i < retries - 1) {
                console.warn(`Error de conexión a DB. Reintentando en 5 segundos... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('Fallo la conexión a la base de datos después de varios reintentos.', error.message);
                throw new Error("Fallo la conexión a la base de datos.");
            }
        }
    }
};

/**
 * Registra el evento de envío de correo (Requisito 3).
 */
const logEmailSent = async (clientId, emailType, payload) => {
    const sql = `
        INSERT INTO email_logs (client_id, email_type, status, message_payload)
        VALUES (?, ?, 'SENT_SUCCESS', ?)
    `;
    // Se registra el estado como 'SENT_SUCCESS' ya que no se implementa el envío real.
    const params = [clientId, emailType, JSON.stringify(payload)];
    await pool.execute(sql, params);
};

module.exports = {
    initDB,
    logEmailSent
};