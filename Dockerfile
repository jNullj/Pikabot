# Stage 1: Build
FROM node:25.0.0-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production

# Install application dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy application source
COPY . .

# Stage 2: Final image
FROM node:25.0.0-alpine

WORKDIR /app

ENV NODE_ENV=production

# Install system dependencies
RUN apk add --no-cache ffmpeg

RUN addgroup -S nodeuser && adduser -S nodeuser -G nodeuser

# Copy only necessary files from the builder stage
COPY --from=builder /app /app

# Ensure all files and database directory are owned by nodeuser
RUN mkdir -p /app/database \
    && chown -R nodeuser:nodeuser /app

USER nodeuser

ENTRYPOINT ["./docker.startup.sh"]
