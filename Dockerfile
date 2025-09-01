# Stage 1: Build
FROM node:24.7.0 AS builder

WORKDIR /app

ENV NODE_ENV=production

# Install application dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Stage 2: Final image
FROM node:24.7.0-slim

WORKDIR /app

ENV NODE_ENV=production

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r nodeuser && useradd -r -g nodeuser nodeuser

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

# Ensure all files and database directory are owned by nodeuser
RUN mkdir -p /app/database \
    && chown -R nodeuser:nodeuser /app

USER nodeuser

ENTRYPOINT ["./docker.startup.sh"]
