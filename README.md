# [jcorry.dev](https://jcorry.dev)

## Tech Stack

- [TypeScript](https://typescriptlang.org)
- [React](https://react.dev)
- [Node.js](https://nodejs.org)
- [Jotai](https://jotai.org)
- [Express](https://expressjs.com)
- [Vite](https://vitejs.dev)
- [Vike](https://vike.dev)
- [Docker](https://www.docker.com)
- [Caddy](https://caddyserver.com)

## Setup for local environment

Lower versions of the prerequisites listed below may work. For a given prerequisite, the provided base version is a version that has been explicitly verified to work for this repository.

### Prerequisites

- [mkcert](https://mkcert.dev) v1.4.4 or later
- Docker v20.10.22 or later
- [Docker Compose](https://docs.docker.com/compose) v2.15.1 or later

```
# Add jcorry-dev.local to your Hosts file
echo "127.0.0.1 jcorry-dev.local" | sudo tee -a /etc/hosts

# Setup SSL Certs
mkcert -install
pushd caddy/certs
mkcert -ecdsa -cert-file bare.pem -key-file bare.key.pem jcorry-dev.local
popd

# Start Docker containers
docker compose up --build -d

# The website will now be available at https://jcorry-dev.local
```
