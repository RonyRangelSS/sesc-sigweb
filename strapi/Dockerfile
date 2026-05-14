FROM node:20-alpine

WORKDIR /opt/app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install

COPY . .

RUN npm rebuild esbuild

EXPOSE 1337
CMD ["sh", "-c", "npm run build && npm run start"]
