# 1. Etapa de Construcción (Base Image)
# Usa una imagen base de Node.js ligera para la ejecución.
FROM node:20-alpine AS base

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 2. Copia y configuración de dependencias
# Copia los archivos package.json y package-lock.json.
# Esto permite que Docker use el cache si las dependencias no cambian.
COPY package*.json ./

# Instala las dependencias. Usa --production para ignorar devDependencies.
RUN npm install --production

# 3. Copia el código fuente
# Copia el resto del código fuente del servicio.
COPY . .

# 4. Exponer el puerto
# El puerto que Hapi usará dentro del contenedor (el mismo que en .env).
EXPOSE 3000

# 5. Comando de inicio (Entrypoint)
# Define el comando que se ejecuta cuando el contenedor se inicia.
CMD [ "node", "server.js" ]