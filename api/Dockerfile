FROM node:16.13.1-alpine3.14

ENV NODE_ENV=production

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]