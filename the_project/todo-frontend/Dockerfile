# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Default environment variables (Frontend → Backend)
ARG VITE_API_URL=http://localhost:3002/
ARG VITE_API_URL
ARG VITE_API_VERSION
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_VERSION=$VITE_API_VERSION

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:stable-alpine AS production

# Copy the built React app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]