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
