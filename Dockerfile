FROM node:lts-alpine3.12

WORKDIR /usr/src/api
COPY package.json .
RUN npm install

COPY . /usr/src/api
RUN npm run build

EXPOSE 4000
CMD [ "npm", "start"]
