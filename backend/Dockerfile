FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

RUN mkdir -p uploads

EXPOSE 4000

CMD ["node", "dist/main.js"]
