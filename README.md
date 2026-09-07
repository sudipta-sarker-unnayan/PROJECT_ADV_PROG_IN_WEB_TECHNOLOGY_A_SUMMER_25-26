# SBMS — Super Admin Module (Day 1 build)

NestJS backend for the Super Admin scope of the Smart Business Management System.
This is the **Sunday (Day 1)** deliverable from the project plan: DB schema, auth
(JWT + bcrypt), role seeding, and full Users + Departments CRUD behind RBAC.

## What's implemented so far

- **Roles**: auto-seeded on boot -- super_admin, manager, employee, client
- **Auth**: POST /api/v1/auth/login -> returns a JWT
- **Users**: full CRUD + activate/deactivate/reset-password, protected by @Roles(SUPER_ADMIN)
- **Departments**: full CRUD, protected by @Roles(SUPER_ADMIN)
- Global ValidationPipe (whitelist + forbidNonWhitelisted) on every route
- Global prefix: all routes are under /api/v1

## Not yet built (Day 2 / Day 3 per the plan)

Employees, Clients, Projects, Attendance (view), Leave (approve/reject), Dashboard --
entities already exist as TypeORM entities (src/employees, src/clients), services/
controllers/modules are next.

## Setup

1. Install dependencies: npm install
2. Create a PostgreSQL database and update .env:
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_NAME=sbms
   JWT_SECRET=change_this_secret_in_production
   JWT_EXPIRES_IN=1d
   PORT=3000
3. Start the app (this also auto-seeds the 4 roles): npm run start:dev
4. Create your first Super Admin account: npm run seed:admin
   Default credentials (override with SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
   env vars): admin@sbms.com / Admin@12345

## Testing with Postman / curl

Login:
POST http://localhost:3000/api/v1/auth/login
{ "email": "admin@sbms.com", "password": "Admin@12345" }

Copy the accessToken from the response and use it as a Bearer token for everything below.

Create a department:
POST http://localhost:3000/api/v1/departments
Authorization: Bearer <token>
{ "name": "Engineering", "description": "Product & platform team" }

Create a user (e.g. a manager account):
POST http://localhost:3000/api/v1/users
Authorization: Bearer <token>
{ "name": "Rafiq Islam", "email": "rafiq@sbms.com", "password": "Manager@123", "role": "manager" }

List / update / delete follow standard REST conventions:
GET /users, GET /users/:id, PATCH /users/:id, DELETE /users/:id,
PATCH /users/:id/activate, PATCH /users/:id/deactivate. Same pattern for /departments.

## Folder structure

src/
├── auth/            login, JWT strategy, auth module
├── roles/           role entity + auto-seed service
├── users/           CRUD, activate/deactivate, reset password
├── departments/     CRUD
├── employees/       entity only (service/controller: Day 2)
├── clients/         entity only (service/controller: Day 2)
├── common/
│   ├── decorators/  @Roles(), @CurrentUser()
│   └── guards/      JwtAuthGuard, RolesGuard
├── database/        TypeORM config + seed-super-admin script
└── main.ts          global prefix /api/v1, ValidationPipe
