# PO Approval System - NestJS Backend

This is the NestJS backend API for the Purchase Order Approval System.

## Prerequisites

- Node.js 20+
- PostgreSQL database (same as the frontend uses)
- pnpm (recommended) or npm

## Setup

1. Install dependencies:
```bash
cd nestjs-backend
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database connection string
```

3. Run the development server:
```bash
pnpm start:dev
```

The API will be available at `http://localhost:3001`.
Swagger documentation is available at `http://localhost:3001/api`.

## Database

This backend uses the same PostgreSQL database as the Next.js frontend. The database schema should already be created via the frontend's Supabase integration.

**Note:** The backend uses TypeORM with `synchronize: false` to prevent automatic schema changes. The schema is managed through the Supabase MCP.

## API Endpoints

### Users
- `GET /users` - Get all users (optional `?role=` filter)
- `GET /users/:id` - Get user by ID

### Purchase Orders
- `POST /purchase-orders` - Create a new PO
- `GET /purchase-orders` - Get all POs (filters: `status`, `creatorId`, `approverRole`)
- `GET /purchase-orders/pending/:role` - Get POs pending for a role
- `GET /purchase-orders/:id` - Get PO by ID
- `POST /purchase-orders/:id/action` - Perform approval action
- `PATCH /purchase-orders/:id/invoice` - Mark approved PO as invoiced

### Approval History
- `GET /approval-history/purchase-order/:poId` - Get history for a PO
- `GET /approval-history/user/:userId` - Get history for a user

## State Machine

The approval workflow follows this state machine:

```
draft → pending_manager → pending_it → pending_finance → approved → invoiced
         ↓ (reject)        ↓ (reject)    ↓ (reject)
       needs_rework ←──────┴─────────────┘
```

**Rules:**
- Orders < $100 skip manager approval
- IT Equipment category requires IT review
- Any approver can reject, sending back to creator for rework
- Only Finance can mark approved POs as invoiced

## Architecture

```
src/
├── common/
│   ├── types.ts          # Shared enums and types
│   └── state-machine.ts  # Approval workflow logic
├── users/
│   ├── entities/         # User entity
│   ├── users.module.ts
│   ├── users.service.ts
│   └── users.controller.ts
├── purchase-orders/
│   ├── entities/         # PurchaseOrder entity
│   ├── dto/              # CreatePO and ApprovalAction DTOs
│   ├── purchase-orders.module.ts
│   ├── purchase-orders.service.ts
│   └── purchase-orders.controller.ts
├── approval-history/
│   ├── entities/         # ApprovalHistory entity
│   ├── approval-history.module.ts
│   ├── approval-history.service.ts
│   └── approval-history.controller.ts
├── app.module.ts
└── main.ts
```

## Connecting to the Frontend

To use this backend with the Next.js frontend instead of direct Supabase:

1. Update the frontend to call these REST endpoints
2. Set `CORS_ORIGIN` to your frontend URL
3. Ensure both use the same PostgreSQL database

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```
