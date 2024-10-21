FROM node:23.0.0

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Install application dependencies
COPY package.json ./
RUN npm install --production

COPY . .

ENTRYPOINT ["./docker.startup.sh"]
