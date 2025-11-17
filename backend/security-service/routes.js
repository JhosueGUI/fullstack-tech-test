// /backend/security-service/routes.js

const { queryDB } = require('./database');

// Función para generar un token alfanumérico aleatorio de 8 dígitos
const generateToken = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};

const routes = [
    {
        // 1. Endpoint para generar un token de seguridad [cite: 25]
        method: 'GET',
        path: '/token',
        handler: async (request, h) => {
            const token = generateToken();
            try {
                // Registrar el token en la tabla 
                await queryDB('INSERT INTO tokens (token) VALUES (?)', [token]);
                return h.response({ 
                    statusCode: 200, 
                    message: 'Token generado exitosamente', 
                    data: { token } 
                }).code(200);
            } catch (error) {
                console.error('Error al registrar token:', error);
                return h.response({ 
                    statusCode: 500, 
                    message: 'Error interno del servidor' 
                }).code(500);
            }
        }
    },
    {
        // 2. Endpoint para validar la autenticidad de un token [cite: 28]
        method: 'POST',
        path: '/validate',
        handler: async (request, h) => {
            const { token } = request.payload;

            if (!token || token.length !== 8) {
                 return h.response({ 
                    statusCode: 400, 
                    message: 'Token inválido o faltante' 
                }).code(400);
            }

            try {
                // Consultar si el token existe en la base de datos
                const [rows] = await queryDB('SELECT token FROM tokens WHERE token = ?', [token]);

                if (rows.length > 0) {
                    return h.response({ 
                        statusCode: 200, 
                        message: 'Token válido',
                        data: { valid: true }
                    }).code(200);
                } else {
                    return h.response({ 
                        statusCode: 401, 
                        message: 'Token inválido o no encontrado',
                        data: { valid: false }
                    }).code(401);
                }
            } catch (error) {
                console.error('Error al validar token:', error);
                return h.response({ 
                    statusCode: 500, 
                    message: 'Error interno del servidor'
                }).code(500);
            }
        }
    }
];

module.exports = routes;