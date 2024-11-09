FROM node:20.10.0 AS development

EXPOSE 3000

WORKDIR /home/jcorry.dev

COPY ./config config
COPY ./src src
COPY .gitignore package-lock.json package.json ./

RUN npm ci

ENTRYPOINT ["npm", "run", "dev"]

FROM development AS production

RUN npm run prod:build

ENTRYPOINT ["npm", "run", "prod:serve"]
