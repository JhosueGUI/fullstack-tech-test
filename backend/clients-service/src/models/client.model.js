const { queryDB } = require("../database/mysql");

// Verifica y crea la tabla 'tokens' si no existe.
const createTable = async () => {
    await queryDB(`
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
    console.log("Tabla 'clients' verificada.");
    await queryDB(`
        CREATE TABLE IF NOT EXISTS global_parameters (
            name VARCHAR(50) PRIMARY KEY,
            value VARCHAR(255) NOT NULL,
            description VARCHAR(255)
        );
    `);
    console.log("Tabla 'global_parameters' verificada.");
    //insertar el parametro inicial EMAIL_ENABLED
    await queryDB(`
        INSERT IGNORE INTO global_parameters (name, value, description) 
        VALUES ('EMAIL_ENABLED', '1', 'Habilita o deshabilita el envío de correos de bienvenida (1= A, 0= I).');
    `);
    console.log("Parámetro 'EMAIL_ENABLED' verificado.");
};

// Función para obtener todos los parámetros globales
const getGlobalParameters = async () => {
    const [rows] = await queryDB('SELECT name, value FROM global_parameters');
    return rows;
};

// Insertar un nuevo Cliente
const insertClient = async (clientData) => {
    const sql = `
        INSERT INTO clients (document_type, document_number, names, last_names, birth_date, phone_number)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        clientData.document_type,
        clientData.document_number,
        clientData.names,
        clientData.last_names,
        clientData.birth_date,
        clientData.phone_number
    ];
    const [result] = await queryDB(sql, params);
    return result.insertId;
};

// Exportar las funciones para usarlas en otras partes de la aplicación 
module.exports = {
    createTable,
    getGlobalParameters,
    insertClient
};