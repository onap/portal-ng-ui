# portal-ng

## Getting started

The portal-ng ui can either be developed against a remote cluster or it's dependencies can be run locally on your machine.

### Developing against a remote cluster

To develop against a remote cluster, the webpack proxy needs to be configured to forward requests to the remote cluster urls.
For that we are providing a `staging.proxy.config.json.template` file that needs to be adjusted with your cluster hostnames and then saved as `staging.proxy.config.json`.
After that, you can either use `npm start` or the `staging.sh` to launch the portal-ng in development mode:

```sh
./staging.sh
```

```sh
npm start
```

### Developing against local containers

We are providing a docker-compose file that can be used to spin up the portal-ng and it's dependencies (like Keycloak or the bff) on your machine.

To do that, execute the `run.sh` in the development folder:

```sh
development/run.sh
```

To stop the portal-ng, portal backend services, Keycloak and the databases run:

```sh
development/stop.sh
```

### Access the ui

Example requests against the portal backend service can be run in your preferred IDE with the `request.http` file from the development folder.

You can access the portal-ng UI via browser with different default user accounts. Note that these accounts have different roles and differ accordingly
in what they are allowed to see in the portal.

URL: <http://localhost>

```yaml
username: onap-admin
password: password

username: onap-designer
password: password

username: onap-operator
password: password
```

You can access the Keycloak UI via browser.

URL: <http://localhost:8080>

```yaml
username: admin
password: password
```

## Docker

### Build the docker image

Run `npm run build -- --prod --base-href=/portal-ui/` to get a production build of the project, this will be used in the `docker build`.

In the configuration of nginx (the `nginx.template`) we have a few environment variables that need to be set.

```sh
export NGINX_PORT=80
export BFF_URL=http://bff:9080/
export WIREMOCK_URL=http://wiremock:8080/
```

Finally, build the image with

```sh
docker build -t portal-ng .
```

### Run the docker image

```sh
docker run -e "NGINX_PORT=80" -e "BFF_URL=http:bff:9080/" -e "WIREMOCK_URL=http://wiremock:8080/" -p 8080:80 portal-ng
```

Note that this will not work on its own, because the referenced containers (`BFF` and `WIREMOCK`) are most likely not available in your local environment.
You would have to run them as well, or pass in other urls (like `example.com`) to get the container running locally.
Obviously this does not get you very far though.
