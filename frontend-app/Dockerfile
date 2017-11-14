FROM node:9.1.0-alpine
MAINTAINER Harry Lee

WORKDIR /home/node

COPY src/package.json .
COPY src/yarn.lock .
RUN yarn install

COPY src/server.js .

CMD ["node", "server.js"]

