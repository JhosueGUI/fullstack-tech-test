//funcion para generar token aleatorio
const generateToken = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
};
//exportamos la funcion
module.exports = {
    generateToken
};