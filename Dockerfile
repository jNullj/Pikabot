# Stage 1: Build
FROM node:23.10.0 AS builder

WORKDIR /app

# Install application dependencies
COPY package.json ./
RUN npm install --production

# Copy application source
COPY . .

# Stage 2: Final image
FROM node:23.10.0

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

ENTRYPOINT ["./docker.startup.sh"]
