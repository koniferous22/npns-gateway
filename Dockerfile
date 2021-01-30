ARG TAG_GATEWAY_ALPINE=lts-alpine3.12
FROM node:$TAG_GATEWAY_ALPINE

WORKDIR /usr/src/api
COPY package.json .
RUN npm install

COPY . /usr/src/api
RUN npm run build

EXPOSE 4000
CMD [ "npm", "start"]
