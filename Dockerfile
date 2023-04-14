FROM openresty/openresty:1.21.4.1-4-alpine
RUN  apk add gettext
COPY server/resty /usr/local/openresty/lualib/resty/
COPY server/nginx* ./
COPY docker_entrypoint.sh .
COPY dist/frontend /usr/share/nginx/html
ENTRYPOINT ["/docker_entrypoint.sh"]
EXPOSE ${NGINX_PORT}
CMD ["nginx", "-g", "daemon off;"]
