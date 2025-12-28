CREATE TABLE users (
	id INTEGER NOT NULL,
	points INTEGER,
	birthday INTEGER,
	last_voice INTEGER,
	last_message INTEGER
);

CREATE UNIQUE INDEX users_id_IDX ON users (id);

CREATE TABLE gods (
	id INTEGER NOT NULL,
	name INTEGER NOT NULL,
	points INTEGER
);

CREATE UNIQUE INDEX gods_id_IDX ON gods (id);

CREATE TABLE selfAddChannels (
	id INTEGER NOT NULL
);

CREATE UNIQUE INDEX selfAddChannels_id_IDX ON selfAddChannels (id);

CREATE TABLE admins (
	id INTEGER NOT NULL
);

CREATE UNIQUE INDEX admins_id_IDX ON admins (id);
