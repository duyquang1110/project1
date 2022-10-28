FROM node:14.18.0-alpine

WORKDIR /data/www

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile
RUN yarn add --dev typescript @types/node
COPY . .

ENV NODE_ENV=production
RUN yarn build-prod

CMD ["npm", "run","start-prod"]
