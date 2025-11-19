
const { createTokenHandler, validateTokenHandler } = require('../controllers/token.controller');

const tokenRoutes = [
    {
        method: 'GET',
        path: '/token',
        options: {
            cors: {
                origin: ['http://localhost:4200', 'http://localhost:8080'],
            }
        },
        handler: createTokenHandler 
    },
    {
        method: 'POST',
        path: '/validate',
        options: {
            cors: {
                origin: ['http://localhost:4200', 'http://localhost:8080'],
            }
        },
        handler: validateTokenHandler
    }
];

module.exports = tokenRoutes;