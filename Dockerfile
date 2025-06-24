# ----------------------------
# Stage 1: Build dependencies
# ----------------------------
FROM node:22.15.0 AS builder

LABEL maintainer="Mohdeep Singh <rokingmohdeep@gmail.com>"
LABEL description="Fragments Node.js microservice"

# Set environment variables
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set working directory
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install --omit=dev

# Copy all source code
COPY . .

# --------------------------
# Stage 2: Runtime image
# --------------------------
FROM node:22.15.0-slim

# Set working directory
WORKDIR /app

# Copy only what's needed from build stage
COPY --from=builder /app .

# Set environment variable
ENV PORT=8080

# Expose service port
EXPOSE 8080

# Start app
CMD ["npm", "start"]
