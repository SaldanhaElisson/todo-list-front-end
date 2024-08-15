FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .




FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app /app



CMD ["npm", "run", "dev", "start:json-server"]
