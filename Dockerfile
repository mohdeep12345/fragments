# ----------------------------
# Stage 1: Build dependencies
# ----------------------------
FROM node:22.15.0 AS builder

LABEL maintainer="Mohdeep Singh <rokingmohdeep@gmail.com>"
LABEL description="Fragments Node.js microservice"

ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY package*.json ./
RUN npm install   # <-- install all dependencies including dev

COPY . .

# --------------------------
# Stage 2: Runtime image
# --------------------------
FROM node:22.15.0-slim

WORKDIR /app

COPY --from=builder /app .

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "start"]
