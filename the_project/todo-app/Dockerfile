# -------- Dependencies Stage --------
FROM node:20-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --ignore-scripts
RUN npm ci --omit=dev --ignore-scripts

# -------- Runtime Stage --------
FROM node:20-alpine
WORKDIR /usr/src/app

COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]
