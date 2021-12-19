FROM node:16.13.1-alpine3.14

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "prod"]