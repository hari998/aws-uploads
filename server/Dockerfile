FROM node:20.10.0-alpine3.18

WORKDIR /server

COPY package.json  package.json
COPY package-lock.json package-lock.json
COPY .env .env

RUN npm install

COPY src src

CMD ["npm", "start"]

