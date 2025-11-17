const redis = require('redis');
const { getGlobalParameters } = require('./database');

let client;

/**
 * Conecta a Redis y carga los parámetros globales desde MySQL.
 */
const initRedis = async () => {
    client = redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });

    client.on('error', (err) => console.error('Redis Client Error:', err));
    
    await client.connect();
    console.log("Conexión a Redis establecida.");

    // Cargar parámetros de MySQL a Redis al iniciar (Requisito 2)
    await loadParametersToRedis();
};

/**
 * Carga todos los parámetros desde la base de datos a Redis.
 */
const loadParametersToRedis = async () => {
    try {
        const parameters = await getGlobalParameters();
        if (parameters && parameters.length > 0) {
            const multi = client.multi();
            parameters.forEach(p => {
                // Usamos HSET para almacenar parámetros como hash
                multi.set(p.name, p.value);
            });
            await multi.exec();
            console.log(`[Redis] Parámetros cargados: ${parameters.length} items.`);
        }
    } catch (error) {
        console.error('[Redis] Error al cargar parámetros de MySQL:', error.message);
    }
};

/**
 * Consulta un parámetro específico en Redis (Requisito 3).
 * @param {string} key - El nombre del parámetro (e.g., 'EMAIL_ENABLED').
 */
const getParameterFromRedis = async (key) => {
    if (!client) return null;
    return await client.get(key);
};

module.exports = {
    initRedis,
    getParameterFromRedis,
    loadParametersToRedis
};