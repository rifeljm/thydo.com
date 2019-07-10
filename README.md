### Installation

Copy .env.example to .env

Create an empty folder for Postgres data files, edit .env and set PG_DATA_DIR to it

`docker-compose up`

For Google SSO to work, you also need to set your google app credentials in .env

Create an empty database

Connect to your postgres server running inside docker

```
docker exec -it `docker ps | grep thydo_postgres | awk '{print $1}'` psql -Upostgres
```

```
CREATE DATABASE thydo;
CREATE USER thydo WITH PASSWORD 'thydo';
GRANT ALL PRIVILEGES ON DATABASE thydo TO thydo;
```

Open browser: http://localhost

### Production

http://thydo.com
