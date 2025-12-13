Agro Marketplace ESD Project

About
This project is an online marketplace for agriculture products.
It has a backend in Spring Boot and a frontend in React.

Roles
- Admin can manage users and categories and can see all orders
- Farmer can add products and manage them and can see orders for their products
- Buyer can browse products and make orders and pay and write reviews

How to run the project

Before you start
- Install Java 17
- Install Node.js
- Install PostgreSQL

Step 1: start PostgreSQL
- Make sure PostgreSQL is running
- Create a database if needed

Step 2: run backend
- Open terminal in the project root
- Run this command
  - mvnw.cmd spring-boot:run
- Backend runs on http://localhost:8080

Step 3: run frontend
- Open terminal in the frontend folder
- Run these commands
  - npm install
  - npm run dev
- Frontend runs on http://localhost:3000

API docs
- Swagger UI: http://localhost:8080/swagger-ui.html

Settings
The backend reads settings from application.properties and environment variables.

Database environment variables
- DB_HOST (default: localhost)
- DB_PORT (default: 5432)
- DB_NAME (default: postgres)
- DB_USERNAME (default: postgres)
- DB_PASSWORD (default: root123)

JWT environment variables
- JWT_SECRET (use a long secret for real projects)
- JWT_EXPIRATION_MS (default: 86400000)

How login works
- You login and the backend returns a token
- The frontend saves the token in the browser
- Every request sends the token to the backend
- The backend checks the token and checks your role

Main workflow
- Farmer adds products
- Buyer creates an order and stock is reduced
- Buyer pays and the order becomes paid
- Farmer revenue is updated after payment

Important API routes

Auth
- POST /api/auth/register
- POST /api/auth/login

Users
- GET /api/users/me
- GET /api/users (admin only)
- DELETE /api/users/{id} (admin only)

Categories
- GET /api/categories
- POST /api/categories (admin only)
- DELETE /api/categories/{id} (admin only)

Products
- GET /api/products
- GET /api/products/{id}
- POST /api/products (farmer or admin)
- PUT /api/products/{id} (farmer only)
- DELETE /api/products/{id} (farmer or admin)

Orders
- POST /api/orders (buyer only)
- GET /api/orders/my (buyer only)
- GET /api/orders/seller (farmer only)
- GET /api/orders (admin only)
- GET /api/orders/{id} (buyer, farmer, admin)
- PATCH /api/orders/{id}/status (farmer or admin)

Payments
- POST /api/payments (buyer or admin)
- GET /api/payments/order/{orderId} (buyer or admin)

Reviews
- GET /api/reviews/product/{productId}
- POST /api/reviews (buyer only)

Messages
- POST /api/messages
- GET /api/messages/inbox

Notes
- Payments are demo and are marked as success immediately
- Frontend sends /api requests to backend using Vite proxy

Troubleshooting
- If you get 401, then login again
- If backend does not start, check port 8080
- If frontend does not start, check port 3000
- If database fails, check DB settings and PostgreSQL
