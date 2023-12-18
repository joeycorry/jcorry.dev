FROM node:20.10.0

# It's expected that these volumes are provided (either by Docker CLI or Docker Compose -- see parent folder)
# - ./website/common:/home/website/common
# - ./website/pages:/home/website/pages
# - ./website/renderer:/home/website/renderer
# - ./website/server:/home/website/server

WORKDIR /home/website

COPY .eslintrc .eslintignore .gitignore .prettierrc .prettierignore nodemon.json package.json \
    pnpm-lock.yaml tsconfig.eslint.json tsconfig.json vite.config.ts ./

RUN npm install -g pnpm@8.12.1
RUN pnpm install --frozen-lockfile

CMD pnpm run dev
