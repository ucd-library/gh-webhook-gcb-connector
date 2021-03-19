FROM node:14

RUN mkdir /service
WORKDIR /service

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY index.js .
COPY config.js .
COPY lib lib

CMD node index.js