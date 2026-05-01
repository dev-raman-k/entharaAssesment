# Enthara Assessment - Project Management App

A full-stack project management web app where users can sign up, create projects, manage team members, assign tasks, and track progress with Admin/Member access rules.

## Features

- JWT authentication with signup, login, protected routes, and password hashing.
- Role-based project access for Admin and Member users.
- Project CRUD with owner, members, status, priority, start date, and end date.
- Task creation, assignment, status updates, priority, due date, comments, and overdue tracking.
- Dashboard metrics for total, pending, in-progress, completed, overdue, status, and priority counts.
- REST APIs backed by SQL relationships and validations.

## Tech Stack

Backend:
- Node.js, Express.js
- Sequelize ORM
- SQLite for local development
- PostgreSQL for Railway production database
- JWT, bcryptjs, express-validator

Frontend:
- React 18
- React Router
- Axios
- Recharts

## Project Structure

```text
backend/
  config/db.js
  controllers/
  middleware/
  models/
  routes/
  utils/
  server.js
frontend/
  public/
  src/
  package.json
.gitignore
netlify.toml
README.md
```

## Local Setup

Backend:

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Default backend URL: `http://localhost:5000`

Frontend:

```bash
cd frontend
npm install
copy .env.example .env
npm start
```

Default frontend URL: `http://localhost:3000`

## Environment Variables

Backend `.env`:

```env
DATABASE_URL=
SQLITE_FILE=database.sqlite
JWT_SECRET=change_this_secret
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Leave `DATABASE_URL` empty locally to use SQLite. On Railway, set `DATABASE_URL` to the PostgreSQL connection string provided by Railway.

Frontend `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

Projects:
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`

Tasks:
- `GET /api/tasks/my-tasks`
- `GET /api/tasks/project/:projectId`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/comments`
- `GET /api/tasks/dashboard/stats`

## SQL Relationships

- `users` has many owned `projects`.
- `projects` has many `project_members`.
- `project_members` joins `projects` and `users`.
- `tasks` belongs to a `project`, an assigned user, and an assigning user.
- `task_comments` belongs to a `task` and a user.

## GitHub Push Steps

```bash
git init
git branch -M main
git remote add origin https://github.com/dev-raman-k/entharaAssesment.git
git add .
git commit -m "Build SQL project management app"
git push -u origin main
```

Do not commit `.env`, `node_modules`, build folders, logs, or local SQLite files. They are excluded in `.gitignore`.

## Railway Deployment

1. Push the project to GitHub.
2. Open Railway and create a new project from the GitHub repository.
3. Add a PostgreSQL database service in the same Railway project.
4. Deploy the backend service from the `backend` folder.
5. Set backend variables:

```env
DATABASE_URL=${{ Postgres.DATABASE_URL }}
JWT_SECRET=use_a_long_random_secret
NODE_ENV=production
FRONTEND_URL=https://your-netlify-site.netlify.app
```

6. Backend build/start:
   - Install command: `npm install`
   - Start command: `npm start`
7. Copy the Railway backend domain, for example `https://your-backend.up.railway.app`.
8. Test `https://your-backend.up.railway.app/api/health`.

## Netlify Deployment

1. Open Netlify and import the same GitHub repository.
2. Use these build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
3. Set Netlify environment variable:

```env
REACT_APP_API_URL=https://your-backend.up.railway.app/api
```

4. Deploy the frontend.
5. Copy the Netlify URL and update Railway `FRONTEND_URL` with that exact URL.
6. Redeploy the Railway backend after updating `FRONTEND_URL`.

## Production Checklist

- Backend `/api/health` returns success.
- Netlify `REACT_APP_API_URL` points to Railway backend plus `/api`.
- Railway `FRONTEND_URL` points to the Netlify site URL.
- Railway PostgreSQL is connected and `DATABASE_URL` is set.
- Signup, login, create project, create task, and dashboard stats work on the live site.
