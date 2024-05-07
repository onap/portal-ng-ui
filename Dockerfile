# the JRE is required by the openapi-generator-cli
FROM eclipse-temurin:17-jre-alpine as builder
RUN apk update && \
    apk add nodejs npm
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration production

FROM nginxinc/nginx-unprivileged:alpine-slim
USER nginx

COPY --from=builder --chown=nginx:nginx /usr/src/app/dist/frontend /usr/share/nginx/html

# Overwrite existing entrypoint from base image
ENTRYPOINT []
EXPOSE ${NGINX_PORT}
CMD ["nginx", "-g", "daemon off;"]
