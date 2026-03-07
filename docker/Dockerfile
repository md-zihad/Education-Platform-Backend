FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm install -g tsx

EXPOSE 5000

CMD ["tsx", "watch", "src/server.ts"]