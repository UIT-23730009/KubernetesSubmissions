# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Frontend will use relative path /api
ARG VITE_API_URL=/api
ARG VITE_API_VERSION
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_VERSION=$VITE_API_VERSION

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve with Nginx + reverse proxy
FROM nginx:stable-alpine AS production

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]