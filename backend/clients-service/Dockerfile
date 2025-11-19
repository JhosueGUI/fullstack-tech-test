FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

# Instala dependencias de producción
RUN npm install --production

COPY . .

# Expone el puerto del servicio de Clientes
EXPOSE 3001

CMD [ "node", "src/index.js" ]