FROM node:20-alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD [ "node", "src/index.js" ]