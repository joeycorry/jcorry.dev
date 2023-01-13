FROM node:18.13.0

# It's expected that these volumes are provided (either by Docker CLI or Docker Compose -- see parent folder)
# - ./website/common:/home/website/common
# - ./website/pages:/home/website/pages
# - ./website/renderer:/home/website/renderer
# - ./website/server:/home/website/server

WORKDIR /home/website
COPY .eslintrc .eslintignore .prettierrc jest.config.ts jest.setup.ts nodemon.json package.json \
    tsconfig.eslint.json tsconfig.json vite.config.ts yarn.lock ./
RUN yarn --frozen-lockfile --non-interactive

CMD yarn dev
