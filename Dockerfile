# the JRE is required by the openapi-generator-cli
FROM eclipse-temurin:17-jre-alpine as builder
RUN apk update && \
    apk add nodejs npm
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build -- --configuration production

FROM openresty/openresty:1.21.4.1-4-alpine
RUN apk add gettext
COPY server/resty /usr/local/openresty/lualib/resty/
COPY server/nginx* ./
COPY docker_entrypoint.sh .
COPY --from=builder /usr/src/app/dist/frontend /usr/share/nginx/html
ENTRYPOINT ["/docker_entrypoint.sh"]
EXPOSE ${NGINX_PORT}
CMD ["nginx", "-g", "daemon off;"]
