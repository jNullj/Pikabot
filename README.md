# Pikabot
A simple discord bot for the followers of lord pika.

dependencies:
 - Node 19.5.0 or newer
 - all node dependencies in pacakge.json

To install Node please consult your os/distro docs.
To install all node package dependencies use `npm install`

# Docker installation

For the docker installation you must have both docker and docker-compose.
To config first rename `.env-dst` to `.env` and insert your api key into the file.
To build and start the container use `docker-compose up -d`.
To upgrade existing install simply pull the latest git commit then rebuild the image.
```
docker-compose down
git pull
docker-compose --build -d
```

## Commands deployment
To deploy slash commands in your server please run the following command in the root directory of the app.
`API_KEY=<secret-api-key> CLIENT_ID=<client-id> GUILD_ID=<guild-id> node deploy-commands.js`

## Database creation
The database should be created automaticly when the database file is missing.

In case you need to generate the file menually you can use `db_creation.sql` to generate the database structure.
SQLite3 db file must be named `database.db` and located in `/database/`.
This can be done using `sqlite3 database/database.db < db_creation.sql`.
