# Storefront Backend Project
Information about all available routes and the database schema can be found in the [Requirements document](REQUIREMENTS.md).

### Environment variables
```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=storefront_backend_dev
POSTGRES_TEST_DB=storefront_backend_test
POSTGRES_USER=storefront_user
POSTGRES_PASSWORD=storefront-paswd
ENV=dev
BCRYPT_PASSWORD=eleccrazy-is-really-crazy
SALT_ROUNDS=10
JWT_SECRET=bestudacitycourse
```
### Installation and setup
The SQL commands to setup the PostgreSQL for the application can be found in the [SQL Script document](setup.sql).
```
// Create Databases for dev and test.

CREATE DATABASE storefront_backend_dev;
CREATE DATABASE storefront_backend_test;

// Create User for those databases.

CREATE USER storefront_user WITH PASSWORD 'storefront-paswd';

// Grant privileges for storefront_user on databases storefront_backend_dev and storefront_backend_test.

\c storefront_backend_dev
GRANT ALL PRIVILEGES ON DATABASE storefront_backend_dev TO storefront_user;
\c storefront_backend_test
GRANT ALL PRIVILEGES ON DATABASE storefront_backend_test TO storefront_user;
```
#### The postgres database runs on port 5432.
## Scripts
- Install: `npm install`
- Create Tables: `db-migrate up`
- Drop Tables: `db-migrate down`
- Format: `yarn prettier`
- Start Server: `yarn watch`
- Test: `yarn test`

## Usage
The server will listen on port 3000

### An example of correct end point call to see all available products would be:
`http://localhost:3000/api/products`
##### N.B An api call to this end point does'nt require any auth token


