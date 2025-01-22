# ***** Stage 1: Build the applications *****
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for both applications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code of both applications
COPY . .

# Build the first application
RUN npm run build-poker-docker --output-path=dist/poker-app 


#******* Stage 2: Build the Node.js API *******
FROM node:18-alpine AS api-builder

WORKDIR /app/api

COPY api/package*.json ./
RUN npm install

COPY api .


#****** Stage 3: Serve the applications using Nginx ******
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built applications to Nginx's public folder
COPY --from=builder /app/dist/poker-app/browser /usr/share/nginx/html

# Copy the Node.js API
COPY --from=api-builder /app/api /app/api

# Copy custom nginx configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Install Node.js in the Nginx image to run the API
RUN apk add --update nodejs npm

# Expose port 80 & 3000
EXPOSE 80 3000

# Start Nginx and Node.js API
CMD nginx && node /app/api/src/index.js