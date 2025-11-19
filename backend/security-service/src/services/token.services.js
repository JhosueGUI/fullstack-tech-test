
const { generateToken } = require('../utils/generateToken');
const { insertToken, findToken } = require('../models/token.model');

//Genera un nuevo token y lo registra en la base de datos.
const createAndRegisterToken = async () => {
    const token = generateToken();
    await insertToken(token);
    return token;
};

//Valida un token verificando su existencia en la base de datos.
const validateToken = async (token) => {
    const isValid = await findToken(token);
    return isValid;
};

module.exports = {
    createAndRegisterToken,
    validateToken
};