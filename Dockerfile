# TODO remove varables
ARG TAG_GATEWAY_ALPINE=lts-alpine3.12
ARG NODE_ENV=development
FROM node:$TAG_GATEWAY_ALPINE AS base_node_alpine

WORKDIR /usr/src/gateway
COPY package.json .
RUN npm install

# VERSION 1 of the image: npm start:dev
FROM base_node_alpine AS npns_production
ENV GATEWAY_START_COMMAND=start
# Source code is copied and built in this image
COPY . /usr/src/gateway
RUN npm run build

# VERSION 2 of the imamge npm start
FROM base_node_alpine AS npns_development
# Dev image will rely on bind mount to watch for file changes
# See top level [docker-compose.yml](https://github.com/koniferous22/npns/blob/master/docker-compose.yml)
ENV GATEWAY_START_COMMAND=start:dev

FROM npns_${NODE_ENV} AS npns_img_final
EXPOSE 4000
# Workaround for injecting starting command via env
# Wait for databases here
CMD  ["sh", "-c", "npm run ${GATEWAY_START_COMMAND}"]
