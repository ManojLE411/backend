# Backend Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation Steps

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string (min 32 characters)
   - `CORS_ORIGIN` - Your frontend URL (e.g., `http://localhost:5173`)

3. **Create Upload Directories**
   The server will automatically create upload directories on first run, but you can create them manually:
   ```bash
   mkdir -p uploads/images/blog
   mkdir -p uploads/images/employees
   mkdir -p uploads/images/projects
   mkdir -p uploads/images/testimonials
   mkdir -p uploads/resumes/internships
   mkdir -p uploads/resumes/jobs
   ```

4. **Run the Server**
   
   Development:
   ```bash
   npm run dev
   ```
   
   Production:
   ```bash
   npm run build
   npm start
   ```

## First Admin User

The first admin user can be created by:
1. Making a POST request to `/api/auth/admin/register` (no authentication required if no admin exists)
2. Or manually creating an admin user in MongoDB

## API Base URL

The API will be available at:
- Development: `http://localhost:5000`
- Production: Set via `API_BASE_URL` in `.env`

## Testing

Run tests:
```bash
npm test
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using port 5000

### File Upload Issues
- Ensure upload directories exist and are writable
- Check `MAX_FILE_SIZE` in `.env` (default: 5MB)

