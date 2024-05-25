FROM node:22.2.0

WORKDIR /app
COPY . .

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y --no-install-recommends \
    ffmpeg \
    build-essential && \
    npm install --production && \
    npm install sodium --production && \
    apt remove -y build-essential && \
    apt autoremove -y && \
    rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["./docker.startup.sh"]
