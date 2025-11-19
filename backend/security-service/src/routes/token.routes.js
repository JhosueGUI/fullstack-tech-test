// src/routes/token.routes.js

const { createTokenHandler, validateTokenHandler } = require('../controllers/token.controller');

const tokenRoutes = [
    {
        method: 'GET',
        path: '/token',
        // El handler ahora es una función del controlador
        handler: createTokenHandler 
    },
    {
        method: 'POST',
        path: '/validate',
        // El handler ahora es una función del controlador
        handler: validateTokenHandler
    }
];

module.exports = tokenRoutes;