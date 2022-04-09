# Pikabot
A simple discord bot for the followers of lord pika.

dependencies:
 - Node 17.3.0
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

## Database creation
The database should be created automaticly when the database file is missing.

In case you need to generate the file menually you can use `db_creation.sql` to generate the database structure.
SQLite3 db file must be named `database.db` and located in `/database/`.
This can be done using `sqlite3 database/database.db < db_creation.sql`.
