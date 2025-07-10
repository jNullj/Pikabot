# Stage 1: Build
FROM node:24.4.0 AS builder

WORKDIR /app

# Install application dependencies
COPY package.json ./
RUN npm install --omit=dev

# Copy application source
COPY . .

# Stage 2: Final image
FROM node:24.4.0-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

ENTRYPOINT ["./docker.startup.sh"]
