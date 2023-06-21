FROM node:14-bullseye-slim as builder
# the JRE is required by the openapi-generator-cli
RUN apt update && apt install -y openjdk-17-jre-headless
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM openresty/openresty:1.21.4.1-4-alpine
RUN apk add gettext
COPY server/resty /usr/local/openresty/lualib/resty/
COPY server/nginx* ./
COPY docker_entrypoint.sh .
COPY --from=builder /usr/src/app/dist/frontend /usr/share/nginx/html
ENTRYPOINT ["/docker_entrypoint.sh"]
EXPOSE ${NGINX_PORT}
CMD ["nginx", "-g", "daemon off;"]
