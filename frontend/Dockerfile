FROM node:19-alpine

RUN mkdir -p /app
WORKDIR /app
COPY ./package*.json /app

RUN yarn install && yarn cache clean
COPY . .

ENV PATH ./node_modules/.bin/:$PATH
