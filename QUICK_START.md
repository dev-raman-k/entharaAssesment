# Quick Start Guide

Get the MERN project management app up and running in 10 minutes!

## 🚀 Prerequisites

Before you start, make sure you have:
- Node.js v14+ installed (https://nodejs.org/)
- npm or yarn package manager
- MongoDB Atlas account (free: https://mongodb.com/cloud/atlas)
- Git installed (https://git-scm.com/)

## 📋 Quick Setup (Local Development)

### 1. Clone Repository

```bash
cd Desktop
git clone https://github.com/dev-raman-k/entharaAssesment.git
cd entharaAssesment
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env with your MongoDB connection string
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/enthara_assessment
# JWT_SECRET=your-secret-key-here

# Start backend server
npm run dev
```

**Backend will be available at:** `http://localhost:5000`

### 3. Frontend Setup (New Terminal)

```bash
# Navigate to frontend from project root
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Start frontend server
npm start
```

**Frontend will be available at:** `http://localhost:3000`

## 🧪 Test the Application

1. Open http://localhost:3000
2. Click "Register"
3. Create a new account
4. Login with credentials
5. Create a project
6. Add team members
7. Create and assign tasks
8. View dashboard

## 📊 Sample Test Data

```
Email: test@example.com
Password: Test@123456
```

## 🗄️ MongoDB Setup

### Create MongoDB Atlas Database:

1. Go to https://mongodb.com/cloud/atlas
2. Click "Build a Database"
3. Select "Shared" (Free tier)
4. Choose your region
5. Create cluster
6. Create database user
7. Whitelist IP address (0.0.0.0/0 for development)
8. Get connection string
9. Replace username, password, and database name

**Connection String Format:**
```
mongodb+srv://username:password@clustername.mongodb.net/enthara_assessment?retryWrites=true&w=majority
```

## 📁 Project Structure

```
enthara-assessment/
├── backend/                    # Express.js API
│   ├── models/                # MongoDB schemas
│   ├── controllers/           # Business logic
│   ├── routes/               # API endpoints
│   ├── middleware/           # Auth, validation
│   ├── server.js             # Entry point
│   └── package.json
└── frontend/                  # React app
    ├── src/
    │   ├── components/       # Reusable components
    │   ├── pages/           # Page components
    │   ├── services/        # API calls
    │   ├── context/         # Auth context
    │   ├── App.js           # Main app
    │   └── index.js         # Entry point
    └── package.json
```

## 🔑 Key Features Available

✅ User authentication with roles  
✅ Project creation and management  
✅ Task assignment and tracking  
✅ Team member management  
✅ Dashboard with statistics  
✅ Real-time status updates  
✅ Role-based access control  

## 🐛 Common Issues & Solutions

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

### MongoDB Connection Failed
1. Check internet connection
2. Verify MongoDB Atlas credentials
3. Whitelist your IP in MongoDB Atlas
4. Check connection string format

### CORS Errors
1. Update FRONTEND_URL in backend .env
2. Restart backend server
3. Clear browser cache
4. Check API endpoint in frontend services/api.js

### Build Errors
```bash
# Clear cache and reinstall
rm -r node_modules
npm install

# Or use npm ci for exact versions
npm ci
```

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/enthara_assessment
JWT_SECRET=your-super-secret-key-min-32-chars
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Next Steps

1. **Local Testing**: Follow the setup above
2. **GitHub**: Push to repository (see DEPLOYMENT_GUIDE.md)
3. **Production**: Deploy to Railway & Netlify (see DEPLOYMENT_GUIDE.md)
4. **Monitoring**: Set up logs and alerts

## 📚 Documentation

- **README.md** - Full project documentation
- **DEPLOYMENT_GUIDE.md** - Complete deployment instructions
- **API Endpoints** - See README.md "🔑 API Endpoints" section

## 💡 Tips

1. Use Postman to test API endpoints
2. Monitor MongoDB Atlas for query performance
3. Check browser DevTools for frontend errors
4. Review server logs for backend issues
5. Use Git branches for features: `git checkout -b feature/name`

## 🤝 Support

- Check logs in terminal
- Review error messages carefully
- Search GitHub issues
- Check MongoDB Atlas status page

## ✨ Happy Coding!

Your project is now set up and ready to go! 🎉

For deployment to production, see **DEPLOYMENT_GUIDE.md**
