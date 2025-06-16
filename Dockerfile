# Dockerfile for fragments microservice
# This file defines how to build a Docker image of our Node.js-based fragments service.
# It sets up the environment, installs dependencies, and defines how the container should run.

# Step 1: Use node version 22.15.0 as the base image
FROM node:22.15.0

# Step 2: Add metadata about the image
LABEL maintainer="Mohdeep Singh <rokingmohdeep@gmail.com>"
LABEL description="Fragments Node.js microservice"

# Step 3: Set environment variables
ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Step 4: Set working directory inside the container
WORKDIR /app

# Step 5: Copy package.json and package-lock.json into image
COPY package*.json ./

# Step 6: Install dependencies inside the container
RUN npm install

# Step 7: Copy the source code into the container
COPY ./src ./src

# Step 8: Copy the .htpasswd file (inside tests directory) into the container
COPY ./tests ./tests

# Step 9: Start the container by running our server using exec form
CMD ["npm", "start"]

# Step 10: Expose the port used by the service
EXPOSE 8080
