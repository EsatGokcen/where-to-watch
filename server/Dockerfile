# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (including dev) to compile TS
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build      # expects "build": "tsc -p tsconfig.json"

# ---------- Production deps stage ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev  # prod-only node_modules

# ---------- Runtime stage ----------
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
# Fly's default internal port is 8080; make your app listen on it
ENV PORT=8080

# Bring in prod node_modules and built JS
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./

EXPOSE 8080
CMD ["node", "dist/index.js"]
