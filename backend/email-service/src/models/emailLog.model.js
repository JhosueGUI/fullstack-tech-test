const { queryDB } = require('../database/mysql');


//Crea la tabla de logs de correos si no existe.

const createLogTable = async () => {
    await queryDB(`
        CREATE TABLE IF NOT EXISTS email_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            client_id INT NOT NULL,
            email_type VARCHAR(50) NOT NULL,
            status VARCHAR(50) NOT NULL,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            message_payload JSON 
        );
    `);
    console.log("Tabla 'email_logs' verificada.");
};


//Registra el evento de envío de correo.

const logEmailSent = async (clientId, emailType, payload) => {
    const sql = `
        INSERT INTO email_logs (client_id, email_type, status, message_payload)
        VALUES (?, ?, 'SENT_SUCCESS', ?)
    `;
    // Usamos el ejecutor de MySQL.
    const params = [clientId, emailType, JSON.stringify(payload)];
    await queryDB(sql, params);
};

module.exports = {
    createLogTable,
    logEmailSent
};