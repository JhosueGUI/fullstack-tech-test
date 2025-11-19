
// Importar la función de consulta desde la nueva ubicación
const { queryDB } = require('../database/mysql'); 

//Verifica y crea la tabla 'tokens' si no existe.
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

//Inserta un token en la base de datos.

const insertToken = async (token) => {
    const [result] = await queryDB('INSERT INTO tokens (token) VALUES (?)', [token]);
    return result.insertId;
};

//Busca un token en la base de datos.
const findToken = async (token) => {
    const [rows] = await queryDB('SELECT token FROM tokens WHERE token = ?', [token]);
    return rows.length > 0;
};

module.exports = {
    createTable,
    insertToken,
    findToken,
};