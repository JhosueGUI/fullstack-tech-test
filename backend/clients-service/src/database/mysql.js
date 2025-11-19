const mysql = require('mysql2/promise');
let connectionPool;

/** Iniciar la conexión a la base de datos */
const initDB = async (retries = 5) => {
  for(let i = 0; i < retries; i++){
    try{
        connectionPool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
        });
        const connection = await connectionPool.getConnection();
        connection.release();
        console.log("Conexión a la base de datos de Clientes establecida.");
        return;
    }catch(error){
        if(i < retries - 1){
            console.warn(`Error de conexión a DB. Reintentando en 5 segundos... (${i + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        } else{
            console.error('Error final de conexión a DB:', error.message);
            throw new Error("Fallo la conexión a la base de datos después de varios reintentos.");
        }
    }
  }  
};
// Función de utilidad para ejecutar consultas usando el pool.
const queryDB = (sql, params) => {
    if (!connectionPool) {
        throw new Error("Pool de base de datos no inicializado.");
    }
    return connectionPool.execute(sql, params);
};

// Exportar las funciones para usarlas en otras partes de la aplicación
module.exports = {
    initDB,
    queryDB
};