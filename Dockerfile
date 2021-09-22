FROM node:14.17.0

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "run", "dev"]