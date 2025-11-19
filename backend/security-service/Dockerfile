#construccion de la imagen
FROM node:20-alpine AS base

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia y configuración de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install --production

# Copia
COPY . .

# Puerto
EXPOSE 3000

CMD [ "node", "src/index.js" ]