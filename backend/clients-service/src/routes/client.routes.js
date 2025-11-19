//importamos los controladores
const {registerSchema,createClientHandler} = require('../controllers/client.controller');

// cremos las rutas para el servicio de clientes
const clientRoutes = [
    {
        method: 'POST',
        path: '/clients',
        options: {
            cors: {
                origin: ['http://localhost:4200', 'http://localhost:8080']
            },
            validate: {
                payload: registerSchema,
                failAction: (request, h, error) => {
                    return h.response({ 
                        statusCode: 400, 
                        message: 'Error de validación de datos del cliente.', 
                        details: error.details 
                    }).code(400).takeover();
                }
            }
        },
        handler: createClientHandler 
    }
];
//exportamos las rutas
module.exports = clientRoutes;