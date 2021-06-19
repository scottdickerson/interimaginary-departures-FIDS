FROM node:14.1-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

EXPOSE 8080 8081
CMD ["yarn", "start"]
