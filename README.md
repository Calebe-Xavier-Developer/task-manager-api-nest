# Task Manager API

A RESTful API for managing tasks, columns, and boards, built with **NestJS**, **Prisma**, and **PostgreSQL**.

## Features

- JWT Authentication with optional 2FA (mocked via console)
- User registration and login
- Password recovery (mocked)
- CRUD for Boards, Columns, and Tasks
- Column and Task reordering
- Swagger documentation
- E2E and Unit testing with coverage report
- Separation of production and test databases (SQLite for tests)

## Technologies

- **NestJS**
- **Prisma ORM**
- **PostgreSQL** (main DB)
- **SQLite** (for tests)
- **JWT Authentication**
- **Jest** (unit + e2e tests)
- **Swagger** (OpenAPI docs)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database running

### Installation

```bash
npm install
```

### Setup Environment Variables

Create two files:

`.env`:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
```

`.env.test`:
```env
DATABASE_URL="file:./test.db"
```

### Database Setup

```bash
npm run migrate:dev     # For dev DB
npm run migrate:test    # For test DB
npm run generate:prod   # Generates Prisma client
```

### Running the App

```bash
npm run start:dev
```

Access Swagger docs at: `http://localhost:3000/api`

## Scripts

```bash
# Linting
npm run lint

# Unit tests
npm run test

# Coverage
npm run test:cov

# Watch mode
npm run test:watch

# E2E tests with SQLite
npm run test:e2e
```

## Test Coverage

- Full coverage for `AuthService`, `AuthController`
- Tests for `TaskService`, `BoardColumnsService`, `BoardsService`, `ColumnsService`
- Controllers tested for all modules

## Swagger Setup

All DTOs are decorated with `@ApiProperty` for proper Swagger support. You can explore and test endpoints at `/api` route.

## Project Structure

```bash
src/
├── auth
├── boards
├── board-columns
├── columns
├── tasks
├── prisma
├── main.ts
```

## License

This project is licensed under the MIT License.

---

> Built by Calebe Xavier 🚀
