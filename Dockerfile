FROM node:20-alpine
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install -g bun && bun install
COPY . .
EXPOSE 3001
CMD ["bun", "run", "index.ts"]
