# Monarch

A modern, scalable e-commerce platform built with microservices architecture.

## Overview

Monarch is a containerized e-commerce system featuring a Next.js frontend and Node.js microservices backend. It provides complete storefront, admin, and checkout capabilities with real-time inventory management and secure payment processing.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend (Next.js)                  │
│   Storefront • Admin • Checkout • Customer       │
└──────────────────┬──────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────┐
│        API Gateway (Express.js)                  │
│              Port: 3000                          │
└──────┬───────────┬──────────┬──────────┬────────┘
       │           │          │          │
    Auth       Inventory   Payment   Notification
   (3001)      (3002)      (3003)    (3004)
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)

### Run with Docker Compose

```bash
docker-compose up
```

**Access Points:**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:3000
- Auth Service: http://localhost:3001

### Local Development

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Services:**
```bash
cd authentication
npm install
npm run dev
```

See each service's `package.json` for available npm scripts.

## Services

| Service | Port | Purpose |
|---------|------|---------|
| **API Gateway** | 3000 | Request routing & load balancing |
| **Authentication** | 3001 | User login, JWT tokens, session management |
| **Inventory** | 3002 | Products, cart, orders, stock management |
| **Payment** | 3003 | Payment processing, transaction handling |
| **Notification** | 3004 | Email/SMS notifications, alerts |

## API Documentation

Each service includes OpenAPI/Swagger documentation:

- **Authentication**: [authentication/api-docs/openapi.yaml](authentication/api-docs/openapi.yaml)
- **Inventory**: [inventory/api-docs/openapi.yaml](inventory/api-docs/openapi.yaml)

## Tech Stack

**Frontend:**
- Next.js 14 (React 18)
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Vitest (testing)

**Backend:**
- Express.js
- TypeScript
- Vitest (testing)
- MongoDB Atlas (database)
- Docker (containerization)

## Key Features

- ✅ Microservices architecture with API Gateway routing
- ✅ Type-safe frontend and backend (TypeScript)
- ✅ Containerized deployment (Docker)
- ✅ JWT-based authentication
- ✅ Real-time inventory management
- ✅ Admin dashboard
- ✅ Secure checkout flow
- ✅ Comprehensive test coverage (Vitest)
- ✅ Error handling & logging

## Development

### Run Tests

```bash
# Frontend
cd frontend && npm test

# Services
cd authentication && npm test
cd inventory && npm test
```

### Code Quality

```bash
# Frontend linting
npm run lint

# Type checking
npm run typecheck
```

## Environment Setup

Each service requires a `.env` file. See service directories for `.env.example`:

```bash
# Authentication
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CORS_ORIGINS=http://localhost:3000

# Inventory
DATABASE_URL=mongodb+srv://...
API_GATEWAY_URL=http://api-gateway:3000

# Payment
STRIPE_SECRET_KEY=sk_...
```

## Project Structure

```
├── frontend/            # Next.js web application
├── api-gateway/         # Express routing layer
├── authentication/      # Auth microservice
├── inventory/          # Inventory & orders service
├── payment/            # Payment processing service
├── notification/       # Notification service
└── shared/             # Shared utilities & types
```

## Deployment

Build images:
```bash
docker build -t monarch-frontend ./frontend
docker build -t monarch-api-gateway ./api-gateway
docker build -t monarch-auth ./authentication
docker build -t monarch-inventory ./inventory
docker build -t monarch-payment ./payment
docker build -t monarch-notification ./notification
```

Deploy with orchestration platform (Kubernetes, Docker Swarm, etc.) using provided Dockerfiles.

## Troubleshooting

**Connection errors:**
- Ensure all services are running: `docker-compose ps`
- Check service logs: `docker-compose logs [service-name]`

**MongoDB connection issues:**
- Verify `MONGO_URI` in `.env` files
- Check network/firewall settings

**Port conflicts:**
- Modify ports in `docker-compose.yml` if needed

## Contributing

1. Create a feature branch from `main`
2. Make changes following existing code style
3. Run tests: `npm test`
4. Commit with clear messages
5. Submit pull request

## License

[Add appropriate license]

## Support

For issues or questions, create a GitHub issue or contact the development team.
