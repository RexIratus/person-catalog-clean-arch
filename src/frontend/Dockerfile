# Stage 1: Build React App
FROM node:22-alpine as build
WORKDIR /app

# Copiamos dependencias (contexto raíz según tu docker-compose)
COPY src/frontend/package*.json ./
RUN npm install

# Copiamos el código fuente
COPY src/frontend/ .

# Definimos que aceptamos un argumento de construcción para sobreescribir el .env local
ARG VITE_API_URL
# Lo convertimos en variable de entorno para que Vite lo lea durante el build
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Configuración necesaria para React Router (SPA)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]