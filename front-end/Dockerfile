# Stage 1: Build the Angular app
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
RUN npm install -g @angular/cli@19.2.0

# Copy package.json and package-lock.json to leverage caching
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular app for production
RUN npm run build --configuration=production

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/dist/demo/browser /usr/share/nginx/html

# Copy custom Nginx configuration
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Inject BACKEND_URL into config.json
ARG BACKEND_URL
RUN echo "{\"backendUrl\": \"$BACKEND_URL\"}" > /usr/share/nginx/html/config.json

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
