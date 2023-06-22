FROM node:20.3.1

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

ENV DISCORD_API_TOKEN=

ENTRYPOINT ["./docker.startup.sh"]
