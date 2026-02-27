# Blue-Collar Onboarding Platform

A comprehensive onboarding platform for blue-collar workers, featuring web and mobile applications with a Node.js backend.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Mobile**: React Native
- **Database**: PostgreSQL
- **Container**: Docker

## Project Structure

```
├── frontend/       # React web application
├── backend/        # Express API server
├── mobile/         # React Native mobile app
├── docker/         # Docker configurations
├── docs/           # Project documentation
└── package.json    # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional)

### Installation

```bash
# Install all dependencies
npm install

# Install frontend dependencies only
npm install --workspace=frontend

# Install backend dependencies only
npm install --workspace=backend
```

### Development

```bash
# Start frontend dev server (port 3000)
npm run dev:frontend

# Start backend dev server (port 4000)
npm run dev:backend

# Run both in development mode
npm run dev:frontend & npm run dev:backend
```

### Docker Development

```bash
# Start all services with Docker
cd docker
docker-compose up -d

# Stop services
docker-compose down
```

## Environment Variables

Copy `.env.example` to `.env` and configure the following:

- `NODE_ENV`: development or production
- `PORT`: Backend server port
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Authentication secret key
- `CORS_ORIGIN`: Allowed CORS origins

## Available Scripts

- `npm run dev:frontend` - Start frontend development server
- `npm run dev:backend` - Start backend development server
- `npm run build:frontend` - Build frontend for production
- `npm run build:backend` - Build backend for production
- `npm run lint` - Run ESLint on all workspaces

## License

ISC
