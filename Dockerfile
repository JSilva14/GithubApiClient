
FROM node:12.14.1-alpine3.11

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000

RUN npm test

CMD [ "node", "index" ]