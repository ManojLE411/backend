# IMTDA Backend API

Node.js + Express + TypeScript + MongoDB backend for IMTDA platform.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string and JWT secret.

4. Run in development:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
npm start
```

## API Documentation

See `BACKEND_API_SPECIFICATION.md` in the root directory for complete API documentation.

## Environment Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)
- `CORS_ORIGIN` - Frontend URL for CORS

## Project Structure

```
src/
├── config/       # Configuration files
├── controllers/  # Route controllers
├── services/     # Business logic
├── models/       # Mongoose models
├── routes/       # Express routes
├── middleware/   # Custom middleware
├── utils/        # Utility functions
├── types/        # TypeScript types
├── app.ts        # Express app setup
└── server.ts     # Server entry point
```

