# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index (GET `/api/products`)
- Show  (GET `/api/products/id`)
- Create (POST `/api/products`) [token required]
- Delete (DELETE `/api/products`) [token required]

#### Users
- Index (GET `/api/users`) [token required]
- Show (GET `/api/users/id`) [token required]
- Create (POST `/api/users`)
- Delete (DELETE `/api/users/id`) [token required]
- Current orders by the user (GET `/api/users/id/orders`) [token required]

#### Orders
- Index (GET `/api/orders`) [token required]
- Show (GET `/api/orders/id`) [token required]
- Create (POST `/api/orders`) [token required]
- Delete (DELETE `/api/orders/id`) [token required]

## Data Shapes
#### Product
Table: *products*
- id `SERIAL PRIMARY KEY`
- name `VARCHAR`
- price `INTEGER`

#### User
Table: *users*
- id `SERIAL PRIMARY KEY`
- username `VARCHAR`
- first_name `VARCHAR`
- last_name `VARCHAR`
- password_digest `VARCHAR`

#### Orders
Table: *orders*
- id `SERIAL PRIMARY KEY`
- user_id `INTEGER` `REFERENCES users(id) ON DELETE CASCADE`
- status `VARCHAR`

Table: *order_products*
- order_id `INTEGER` `REFERENCES orders(id) ON DELETE CASCADE` 
- product_id `INTEGER` `REFERENCES products(id) ON DELETE CASCADE`
- quantity `INTEGER`
