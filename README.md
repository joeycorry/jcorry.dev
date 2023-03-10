# [jcorry.dev](https://jcorry.dev)

## Tech Stack

- [TypeScript](https://typescriptlang.org)
- [React](https://reactjs.org)
- [Node.js](https://nodejs.org/)
- [Jotai](https://jotai.org)
- [Express](https://expressjs.com)
- [Vite](https://vitejs.dev)
- [vite-plugin-ssr](https://vite-plugin-ssr.com)
- [Docker](https://www.docker.com/)
- [NGINX](https://www.nginx.com)

## Setup for local environment

### Prerequisites (HTTP)

- Node.js v18.13.0 or later
- [Yarn](https://yarnpkg.com/) v1.22.19 or later (or [NPM](https://www.npmjs.com) v8.19.3 or later)

#### Yarn

```
# Install dependencies and run dev server
pushd website
yarn && yarn dev
popd
```

#### NPM

```
# Install dependencies and run dev server
pushd website
npm install && npm run dev
popd
```

### Prerequisites (HTTPS)

Lower versions of the prerequisites listed below may work. For a given prerequisite, the provided base version is a version that has been explicitly verified to work for this repository.

- [mkcert](https://mkcert.dev/) v1.4.4 or later
- [Docker](https://www.docker.com/) v20.10.22 or later
- [Docker Compose](https://docs.docker.com/compose/) v2.15.1 or later

```
# Add jcorry-dev.local to your Hosts file
echo "127.0.0.1 jcorry-dev.local" | sudo tee -a /etc/hosts

# Setup SSL Certs
mkcert -install
pushd nginx/certs
mkcert -cert-file bare.pem -key-file bare.key.pem jcorry-dev.local
popd

# Start Docker containers
docker compose up --build -d

# The website will now be available at https://jcorry-dev.local
```

#### Optional

- Yarn v1.22.19 or later (or NPM v8.19.3 or later)

##### Yarn

```
# Install dev dependencies
yarn --dev
```

##### NPM

```
# Install dev dependencies
npm install
```
