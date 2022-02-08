# Pikabot
A simple discord bot for the followers of lord pika.

dependencies:
 - Node 17.3.0
 - all node dependencies in pacakge.json

To install Node please consult your os/distro docs.
To install all node package dependencies use `npm install`

## Database creation
Before running the bot you must create a database using the provided `db_creation.sql` file.
SQLite3 db file must be named database.db in the root folder of the project.
This can be done using `sqlite3 database.db < db_creation.sql`.
