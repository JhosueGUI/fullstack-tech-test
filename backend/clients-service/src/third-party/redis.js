// src/third-party/redis.js
// Maneja la conexión y las operaciones con Redis

const redis = require('redis');
// La función para cargar parámetros ahora viene del Modelo
const { getGlobalParameters } = require('../models/client.model'); 

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

    // Cargar parámetros de MySQL a Redis al iniciar
    await loadParametersToRedis();
};

/**
 * Carga todos los parámetros desde la base de datos a Redis.
 */
const loadParametersToRedis = async () => {
    try {
        const parameters = await getGlobalParameters(); // Llama al Modelo
        if (parameters && parameters.length > 0) {
            const multi = client.multi();
            parameters.forEach(p => {
                multi.set(p.name, p.value);
            });
            await multi.exec();
            console.log(`[Redis] Parámetros cargados: ${parameters.length} items.`);
        }
    } catch (error) {
        // No lanzamos un error fatal aquí, ya que el servicio debe continuar sin Redis si es posible.
        console.error('[Redis] Error al cargar parámetros de MySQL:', error.message); 
    }
};

/**
 * Consulta un parámetro específico en Redis.
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