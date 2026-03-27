# Monarch

## Overview

Monarch is an e-commerce platform designed to demonstrate modern microservice architecture principles. The system provides a unified shopping experience through a Next.js frontend while managing distinct business domains (authentication, inventory, payments, notifications) across independent, scalable microservices.

---

## Architecture

```
Frontend (Next.js, Port 3000)
           ↓
API Gateway (Express.js, Port 8080)
    ↓         ↓        ↓         ↓
Auth    Inventory  Payment  Notification
Services (Ports 8081-8084)
    ↓         ↓        ↓         ↓
MongoDB instances (per-service databases)
```

**Design Principles**:
- **Single Responsibility**: Each service manages one business domain
- **Service Independence**: Independently deployable and scalable
- **API Gateway Pattern**: Unified entry point for all clients
- **Database per Service**: Isolated data stores per microservice
- **Loose Coupling**: Minimal dependencies between services

---

## Services

### API Gateway
- Central request routing and authentication
- CORS handling and security middleware
- Request/response logging
- Error normalizing

**Technology**: Express.js (JavaScript)  
**Port**: 8080

### Authentication Service
- User registration and login
- JWT token generation and validation
- Rate limiting (5 login attempts per 30 minutes)
- User profile management

**Technology**: Express.js (TypeScript), MongoDB  
**Port**: 8081

### Inventory Service
- Product catalog and management
- Stock management and availability checks
- Cart operations
- Wishlist management
- Order processing

**Technology**: Express.js (TypeScript), MongoDB  
**Port**: 8082

### Payment Service
- Payment processing
- Transaction management

**Technology**: Express.js (TypeScript), MongoDB  
**Port**: 8083

### Notification Service
- Event-based notifications
- Email and real-time alerts

**Technology**: Express.js (TypeScript), MongoDB  
**Port**: 8084

---

## Getting Started

### Prerequisites
- Node.js 16+
- Docker & Docker Compose
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies for each service:
   ```bash
   cd api-gateway && npm install
   cd ../authentication && npm install
   cd ../inventory && npm install
   cd ../payment && npm install
   cd ../notification && npm install
   cd ../frontend && npm install
   ```

3. Configure environment variables for each service

4. Start services:
   ```bash
   docker-compose up
   ```

---

## Development

Each service directory contains independent TypeScript/JavaScript projects:

- `api-gateway/` - Gateway service
- `authentication/` - Auth service
- `inventory/` - Inventory service
- `payment/` - Payment service
- `notification/` - Notification service
- `frontend/` - Next.js frontend
- `shared/` - Shared utilities and types

---

## Testing

Run tests for each service:
```bash
npm test
```

---

### Member 2: Inventory Service Owner
**Responsibility**: Product catalog and availability management

**Services & Features**:
- Product CRUD operations (Create, Read, Update, Delete)
- Advanced filtering and pagination
- Stock level management and updates
- Shopping cart operations
- Wishlist management
- Order tracking and management
- Product search with multiple criteria

**Technology Stack**:
- Express.js (TypeScript)
- Mongoose (MongoDB)
- Rate limiting on inventory operations
- Input validation with Zod

**API Endpoints**:
- `GET /inventory` - List all products (with filtering)
- `GET /inventory/:id` - Get product by ID
- `POST /inventory` - Create new product
- `PUT /inventory/:id` - Update product
- `DELETE /inventory/:id` - Delete product
- `GET /cart` - Get cart items
- `POST /cart` - Add to cart
- `GET /wishlist` - Get wishlist items
- `POST /orders` - Create order

**Code Location**: `inventory/src/`

---

## 🌐 API Gateway: Avoiding Multiple Ports

### Problem Statement
Without an API Gateway:
- Frontend would need to connect to multiple service ports (8081, 8082)
- CORS configuration becomes complex (multiple origins)
- Service discovery logic lives in frontend
- Adding/removing services requires frontend changes
- No unified request/response handling

### Solution: Single-Port Gateway

The **API Gateway** (port 8080) acts as:
1. **Single Entry Point**: Frontend connects only to port 8080
2. **Router**: Routes `/auth/*` requests to Authentication Service (8081)
3. **Router**: Routes `/inventory/*` requests to Inventory Service (8082)
4. **CORS Manager**: Centralized CORS handling for all services
5. **Request Logger**: All requests logged through gateway middleware
6. **Error Handler**: Graceful error responses when upstream services unavailable

### Request Flow Example

**User Registration via Gateway**:
```
Frontend (http://localhost:3000)
  ↓
POST http://localhost:8080/auth/register
  ↓
API Gateway (removes /auth prefix, forwards to service)
  ↓
POST http://localhost:8081/register
  ↓
Authentication Service processes request
  ↓
Response returned through gateway to frontend
```

### Benefits
- ✅ **Simplified Frontend**: Single API endpoint (`http://localhost:8080`)
- ✅ **Service Independence**: Can change internal ports without frontend impact
- ✅ **Centralized Logging**: All requests logged in one place
- ✅ **Unified Security**: Rate limiting, CORS, headers applied consistently
- ✅ **Easy Service Discovery**: New services added with single gateway route
- ✅ **Production Ready**: Standard microservices pattern used in industry

---

## 📁 Repository Structure

```
Green-Cart/
├── api-gateway/                    # Single entry point for all services
│   ├── src/
│   │   ├── index.js               # Express app setup
│   │   ├── config.js              # Environment config
│   │   ├── middleware/            # Security, CORS, logging
│   │   └── routes/
│   │       └── proxy.js           # Service routing logic
│   ├── package.json
│   ├── .env.example
│   ├── Dockerfile
│   └── vitest.config.ts
│
├── authentication/                 # Member 1: Auth Service
│   ├── src/
│   │   ├── app.ts                 # Express app setup
│   │   ├── index.ts               # Server startup
│   │   ├── config/                # Environment & config
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/
│   │   │   └── auth.ts            # Auth endpoints
│   │   ├── middleware/            # Auth, error handling
│   │   ├── models/
│   │   │   └── User.ts            # User schema
│   │   ├── validation/            # Input schemas
│   │   └── errors/
│   │       └── AppError.ts        # Error classes
│   ├── api-docs/
│   │   └── openapi.yaml           # Swagger documentation
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   └── Dockerfile
│
├── inventory/                      # Member 2: Inventory Service
│   ├── src/
│   │   ├── app.ts                 # Express app setup
│   │   ├── index.ts               # Server startup
│   │   ├── config/                # Environment & config
│   │   ├── controllers/           # Request handlers
│   │   ├── routes/
│   │   │   ├── inventory.ts       # Product endpoints
│   │   │   ├── cart.ts            # Cart endpoints
│   │   │   ├── wishlist.ts        # Wishlist endpoints
│   │   │   └── order.ts           # Order endpoints
│   │   ├── middleware/            # Error handling, logging
│   │   ├── models/                # Data schemas
│   │   ├── validation/            # Input schemas
│   │   └── services/              # Business logic
│   ├── api-docs/
│   │   └── openapi.yaml           # Swagger documentation
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/                       # Next.js UI
│   ├── app/
│   │   ├── (auth)/                # Login/Register pages
│   │   ├── products/              # Product browsing
│   │   ├── checkout/              # Cart checkout
│   │   ├── admin/                 # Admin dashboard
│   │   └── components/            # React components
│   ├── lib/
│   │   ├── api.ts                 # API service layer
│   │   ├── auth-context.tsx       # Auth state management
│   │   ├── cart-context.tsx       # Cart state
│   │   └── wishlist-context.tsx   # Wishlist state
│   ├── package.json
│   ├── .env.example
│   ├── tsconfig.json
│   ├── next.config.mjs
│   └── Dockerfile
│
├── shared/
│   ├── architecture/              # Architecture diagrams
│   └── docs/                       # Shared documentation
│
├── package.json                    # Root package (if monorepo setup)
└── README.md                       # This file
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js 20+** (download: https://nodejs.org/)
- **MongoDB 5.0+** (local or Docker)
- **npm** or **yarn** package manager

### Local Development Setup

#### Step 1: Start MongoDB
```bash
# Using Docker (recommended)
docker run -d -p 27017:27017 --name mongodb mongo:latest

# OR if MongoDB is installed locally
mongod
```

#### Step 2: Setup Environment Files
Copy `.env.example` to `.env` in each service:
```bash
cp authentication/.env.example authentication/.env
cp inventory/.env.example inventory/.env
cp api-gateway/.env.example api-gateway/.env
cp frontend/.env.example frontend/.env.local
```

#### Step 3: Start Services (Open 4 Terminal Tabs)

**Terminal 1: Authentication Service (Port 8081)**
```bash
cd authentication
npm install
npm run dev
# Expected output: Server running on port 8081
```

**Terminal 2: Inventory Service (Port 8082)**
```bash
cd inventory
npm install
npm run dev
# Expected output: Server running on port 8082
```

**Terminal 3: API Gateway (Port 8080)**
```bash
cd api-gateway
npm install
npm run dev
# Expected output: API Gateway listening on port 8080
```

**Terminal 4: Frontend (Port 3000)**
```bash
cd frontend
npm install
npm run dev
# Expected output: ▲ Next.js running on http://localhost:3000
```

#### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8080
- **Auth Service (direct)**: http://localhost:8081
- **Inventory Service (direct)**: http://localhost:8082

---

## 🧪 Testing Endpoints

### Health Checks
```bash
# Test each service individually
curl http://localhost:8081/health      # Auth service
curl http://localhost:8082/health      # Inventory service
curl http://localhost:8080/health      # Gateway

# Response: {"status":"ok","service":"<service-name>"}
```

### Through API Gateway
```bash
# Register a new user (via gateway)
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123!",
    "firstName":"John",
    "lastName":"Doe"
  }'

# Login (via gateway)
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "password":"SecurePass123!"
  }'

# Get products (via gateway)
curl "http://localhost:8080/inventory?limit=10&page=1"

# Get product by ID (via gateway)
curl "http://localhost:8080/inventory/[productId]"
```

### Direct Service Access
```bash
# Access auth service directly (without gateway)
curl http://localhost:8081/auth/register

# Access inventory service directly (without gateway)
curl http://localhost:8082/inventory
```

---

## 📚 API Documentation

Each microservice includes OpenAPI/Swagger documentation:

### Authentication Service
- **Location**: `authentication/api-docs/openapi.yaml`
- **Endpoints**: Register, Login, Refresh Token, Get Profile
- **Security**: JWT Bearer token validation

### Inventory Service
- **Location**: `inventory/api-docs/openapi.yaml`
- **Endpoints**: Product CRUD, Cart, Wishlist, Orders
- **Features**: Filtering, pagination, sorting

---

## 🔒 Security Features

- ✅ **Password Hashing**: Bcrypt with salt rounds
- ✅ **JWT Authentication**: Access + Refresh token pattern
- ✅ **Rate Limiting**: Protection against brute-force attacks
- ✅ **CORS Configuration**: Controlled cross-origin access
- ✅ **Input Validation**: Zod schemas for request validation
- ✅ **Error Handling**: Secure error messages (no stack traces exposed)
- ✅ **Helmet**: Security headers for all responses
- ✅ **Request Logging**: Centralized logging through gateway

---

## 🐳 Docker & Containerization

Each service includes a production-ready Dockerfile:

```bash
# Build auth service image
cd authentication
docker build -t auth-service:latest .

# Build inventory service image
cd inventory
docker build -t inventory-service:latest .

# Build API gateway image
cd api-gateway
docker build -t api-gateway:latest .

# Build frontend image
cd frontend
docker build -t frontend:latest .
```

---

## ✅ Assignment Compliance

This project fulfills all MTIT 2026 assignment requirements:

1. ✅ **Microservices Definition** - Authentication and Inventory services clearly defined with member attribution
2. ✅ **API Gateway Pattern** - Single port avoids multiple consumer connections
3. ✅ **Folder Structure** - Professional organization with Dockerfile, package.json, src/, api-docs/ per service
4. ✅ **Swagger Documentation** - OpenAPI specs available for both services
5. ✅ **No Build Breaks** - All services independently runnable with clean builds
6. ✅ **Direct & Gateway Access** - Endpoints accessible directly and through gateway
7. ✅ **Team Attribution** - Each member's contribution clearly documented

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14, TypeScript, React 18 | UI and user interactions |
| **API Gateway** | Express.js, http-proxy-middleware | Request routing and centralization |
| **Backend Services** | Express.js, TypeScript | Microservice implementations |
| **Database** | MongoDB, Mongoose | Data persistence |
| **Security** | Bcrypt, JWT, Express-rate-limit | Authentication and protection |
| **Testing** | Vitest | Unit and integration tests |
| **Containerization** | Docker | Service deployment |

---

## 📝 Notes

- Each service runs on its own port but is accessed through the gateway (port 8080)
- Database URLs are configured via environment variables
- JWT secrets must be changed in production
- Rate limiting thresholds can be adjusted in .env files
- All services log requests for debugging and monitoring

---

## 🤝 Support & Troubleshooting

**Port Already in Use**:
```bash
# Find and kill process on specific port
lsof -i :8080
kill -9 <PID>
```

**MongoDB Connection Failed**:
- Ensure MongoDB is running (`mongod` or Docker container)
- Check MONGODB_URI in .env matches your setup

**CORS Issues**:
- Verify CORS_ORIGINS in .env includes frontend URL
- Check that API gateway CORS middleware is enabled

**Service Not Responding**:
- Test health endpoints: `curl http://localhost:[port]/health`
- Check service logs in terminal for errors
- Verify environment variables are correctly set

---

## 📌 Assignment Submission

**Deliverables**:
1. ✅ Source code (this repository)
2. ✅ API Gateway implementation
3. ✅ Two independent microservices
4. ✅ Professional README (this file)
5. ✅ OpenAPI documentation
6. ⏳ Slide deck with screenshots (to be created during presentation)

**Submission Date**: 31.03.2026  
**Module**: IT4020 (Modern Topics in IT)  
**Institution**: SLIIT - Faculty of Computing

---

**Last Updated**: March 28, 2026  
**Status**: ✅ Development Complete | ⏳ Presentation Pending
