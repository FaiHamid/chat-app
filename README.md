# Chat App

Full-stack real-time chat application.

**Stack:** React + TypeScript + Vite · Node.js + Express · PostgreSQL + Sequelize · Socket.IO · Docker

---

## Prerequisites

- [Node.js 20+](https://nodejs.org/)
- [Docker + Docker Compose](https://docs.docker.com/get-docker/)

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

### 2. Create environment file

```bash
cp .env.example .env
```

Fill in the values in `.env`:


## Running with Docker (recommended)

```bash
# Build and start all services (backend, frontend, postgres)
npm run docker:up
# або напряму:
docker-compose up --build -d

# View logs
npm run docker:logs
# або напряму:
docker-compose logs -f

# Stop all services
npm run docker:down
# або напряму:
docker-compose down
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | http://localhost:8000  |
| Database | localhost:5432         |

> The database schema is synced automatically on backend startup.

---

## Running locally (without Docker)

You need a running PostgreSQL instance first.

### Install dependencies

```bash
npm install
```

This installs dependencies for both `backend` and `frontend` workspaces.

### Start backend

```bash
npm run dev:backend
```

### Start frontend

```bash
npm run dev:frontend
```