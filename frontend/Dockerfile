# ---------------------------------------------------
FROM node:20-alpine AS build

RUN npm install -g @angular/cli

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN ng build --configuration=production --output-path=dist


# SERVE (Servidor Nginx Ligero)

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/browser /usr/share/nginx/html 

RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]