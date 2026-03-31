# Monarch - Order Service

Microservice for managing orders. Runs on **Port 8084**.

## Functionality
- Manage order data
- Create & update orders
- Cancel & view order details
- Link orders with customers & products
- Optional inventory availability validation before order creation
- JWT-protected user/admin access control

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Create new order |
| GET | /orders | Get all orders |
| GET | /orders/:id | Get order by ID |
| PUT | /orders/:id | Update order |
| DELETE | /orders/:id | Delete order |
| GET | /health | Service health check |
| GET | /docs | Swagger UI |
| GET | /docs/openapi.json | OpenAPI JSON |

Gateway-compatible mounting is included, so proxied requests that strip the `/orders` prefix can still be routed successfully.

## Setup

```bash
npm install
npm run dev
```

Required environment variables:

```env
PORT=8084
MONGO_URI=mongodb://localhost:27017/orderdb

# Must match authentication service signing key
JWT_ACCESS_SECRET=replace_with_auth_access_secret
# fallback if you still use one shared key
JWT_SECRET=replace_with_shared_secret

# Optional inventory integration
INVENTORY_SERVICE_URL=http://localhost:8082
INVENTORY_TIMEOUT_MS=3000
INVENTORY_VALIDATION_REQUIRED=false
```

## Swagger UI
Visit: `http://localhost:8084/docs`

## API Gateway
- If API Gateway is configured to proxy `/orders` and strip the prefix, this service will accept those forwarded paths.
- Direct access also remains available at `/orders/*`.
