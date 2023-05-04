# <a href="https://jcorry.dev" target="_blank">jcorry.dev</a>

## Tech Stack

- <a href="https://typescriptlang.org" target="_blank">TypeScript</a>
- <a href="https://react.dev" target="_blank">React</a>
- <a href="https://jotai.org" target="_blank">Jotai</a>
- <a href="https://nodejs.org" target="_blank">Node.js</a>
- <a href="https://expressjs.com" target="_blank">Express</a>
- <a href="https://vitejs.dev" target="_blank">Vite</a>
- <a href="https://vite-plugin-ssr.com" target="_blank">vite-plugin-ssr</a>
- <a href="https://www.docker.com" target="_blank">Docker</a>
- <a href="https://caddyserver.com" target="_blank">Caddy</a>

## Setup for local environment

### Prerequisites (HTTP)

- Node.js v18.13.0 or later
- <a href="https://classic.yarnpkg.com" target="_blank">Yarn</a> v1.22.19 or later (or <a href="https://www.npmjs.com" target="_blank">NPM</a> v8.19.3 or later)

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

- <a href="https://mkcert.dev" target="_blank">mkcert</a> v1.4.4 or later
- Docker v20.10.22 or later
- <a href="https://docs.docker.com/compose" target="_blank">Docker Compose<a> v2.15.1 or later

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
