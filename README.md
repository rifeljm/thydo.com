### Installation

Copy .env.example to .env

Create an empty folder for Postgres data files, edit .env and set PG_DATA_DIR to it

`docker-compose up`

For Google SSO to work, you also need to set your google app credentials in .env

Connect to your postgres server running inside docker

```
docker exec -it `docker ps | grep thydo_postgres | awk '{print $1}'` psql -Upostgres
```

Create an empty database

```
CREATE DATABASE thydo;
CREATE USER thydo WITH PASSWORD 'thydo';
GRANT ALL PRIVILEGES ON DATABASE thydo TO thydo;
```

Open browser: http://localhost

### Production

http://thydo.com

### Warning !!!

At the moment Thydo only works in Google Chrome browser

### Todo

- e2e tests, unit tests
- time events (meetings?)
- undo
- lists (subtodos, shopping list,...) inside modal
- custom colors
- history (action log)
- PWA app (push notifications)
- integrations: instagram, twitter, google photos,...
- sharing
- pomodoro timer
- browser compatibility (Firefox, Safari, IE)
- multiday mouse events to change or move date
