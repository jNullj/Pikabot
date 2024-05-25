# Pikabot
A simple Discord bot for the followers of Lord Pika.

dependencies:
 - Node 22.2.0 or newer
 - all node dependencies in package.json

To install Node please consult your os/distro docs.
To install all node package dependencies use `npm install` if installing on the host and without the docker container.
If you run on the host without the docker container you must also install ffmpeg and set your token in `botinfo.js`.

# Docker installation

For the docker installation you must have both docker and docker compose.
To config first rename `.env-dst` to `.env` and insert your API key into the file.
For commands deployment you must also insert your client id and guild id.
To build and start the container use `docker compose up -d`.
To upgrade existing install simply pull the latest git commit then rebuild the image.
```
docker compose down
git pull
docker compose up --build -d
```

## Commands deployment
To deploy slash commands in your server connect to the container using:
`docker exec -it pikabot-app-1 bash`
and run:
`node deploy-commands.js`
Only do that if necessary, after installation and after changes in commands, as API calls for those requests are limited.
If running on the host without docker you can simply run `node deploy-commands.js` after setting all environment variables set in `.env-dst`.

## Database creation
The database should be created automatically when the database file is missing.

If you need to generate the file manually you can use `db_creation.sql` to generate the database structure.
SQLite3 db file must be named `database.db` and located in `/database/`.
This can be done using `sqlite3 database/database.db < db_creation.sql`.
