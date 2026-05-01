# API Documentation

Complete API reference for the Enthara Assessment Project Management Application.

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Get Token
Login to receive a JWT token that must be included in subsequent requests.

---

## 📡 Base URL

**Development:** `http://localhost:5000/api`
**Production:** `https://your-railway-url/api`

---

## 🔌 Endpoints

### AUTH ENDPOINTS

#### 1. Register User
- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth:** None

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Member"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "63f7a1b8c9e8d7e6f5g4h3i2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

#### 2. Login User
- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth:** None

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "63f7a1b8c9e8d7e6f5g4h3i2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member"
  }
}
```

**Error (400):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### 3. Get Current User Profile
- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a1b8c9e8d7e6f5g4h3i2",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Member",
    "avatar": null,
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

#### 4. Update User Profile
- **URL:** `/auth/profile`
- **Method:** `PUT`
- **Auth:** Required

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "avatar": "https://avatar-url.com/image.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a1b8c9e8d7e6f5g4h3i2",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "Member",
    "avatar": "https://avatar-url.com/image.jpg",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

### PROJECT ENDPOINTS

#### 1. Create Project
- **URL:** `/projects`
- **Method:** `POST`
- **Auth:** Required

**Request Body:**
```json
{
  "name": "E-Commerce Platform",
  "description": "Build a scalable e-commerce platform",
  "startDate": "2024-01-20",
  "endDate": "2024-03-20",
  "priority": "High"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a2b8c9e8d7e6f5g4h3i3",
    "name": "E-Commerce Platform",
    "description": "Build a scalable e-commerce platform",
    "owner": {
      "_id": "63f7a1b8c9e8d7e6f5g4h3i2",
      "name": "John Doe"
    },
    "members": [
      {
        "user": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" },
        "role": "Admin"
      }
    ],
    "status": "Active",
    "priority": "High",
    "startDate": "2024-01-20T00:00:00Z",
    "endDate": "2024-03-20T00:00:00Z",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

#### 2. Get All Projects
- **URL:** `/projects`
- **Method:** `GET`
- **Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "63f7a2b8c9e8d7e6f5g4h3i3",
      "name": "E-Commerce Platform",
      "description": "Build a scalable e-commerce platform",
      "owner": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" },
      "members": [{ "user": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" }, "role": "Admin" }],
      "status": "Active",
      "priority": "High",
      "startDate": "2024-01-20T00:00:00Z",
      "endDate": "2024-03-20T00:00:00Z"
    }
  ]
}
```

---

#### 3. Get Single Project
- **URL:** `/projects/:id`
- **Method:** `GET`
- **Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a2b8c9e8d7e6f5g4h3i3",
    "name": "E-Commerce Platform",
    "description": "Build a scalable e-commerce platform",
    "owner": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" },
    "members": [
      { "user": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" }, "role": "Admin" },
      { "user": { "_id": "63f7a3b8c9e8d7e6f5g4h3i4", "name": "Jane Smith" }, "role": "Member" }
    ],
    "status": "Active",
    "priority": "High",
    "startDate": "2024-01-20T00:00:00Z",
    "endDate": "2024-03-20T00:00:00Z"
  }
}
```

---

#### 4. Update Project
- **URL:** `/projects/:id`
- **Method:** `PUT`
- **Auth:** Required (Project owner only)

**Request Body:**
```json
{
  "name": "E-Commerce Platform v2",
  "status": "In Progress",
  "priority": "Critical"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a2b8c9e8d7e6f5g4h3i3",
    "name": "E-Commerce Platform v2",
    "status": "In Progress",
    "priority": "Critical",
    "updatedAt": "2024-01-20T11:30:00Z"
  }
}
```

---

#### 5. Delete Project
- **URL:** `/projects/:id`
- **Method:** `DELETE`
- **Auth:** Required (Project owner only)

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted"
}
```

---

#### 6. Add Member to Project
- **URL:** `/projects/:id/members`
- **Method:** `POST`
- **Auth:** Required (Project owner only)

**Request Body:**
```json
{
  "userId": "63f7a3b8c9e8d7e6f5g4h3i4",
  "role": "Member"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a2b8c9e8d7e6f5g4h3i3",
    "members": [
      { "user": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" }, "role": "Admin" },
      { "user": { "_id": "63f7a3b8c9e8d7e6f5g4h3i4", "name": "Jane Smith" }, "role": "Member" }
    ]
  }
}
```

---

#### 7. Remove Member from Project
- **URL:** `/projects/:id/members/:userId`
- **Method:** `DELETE`
- **Auth:** Required (Project owner only)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a2b8c9e8d7e6f5g4h3i3",
    "members": [
      { "user": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" }, "role": "Admin" }
    ]
  }
}
```

---

### TASK ENDPOINTS

#### 1. Create Task
- **URL:** `/tasks`
- **Method:** `POST`
- **Auth:** Required

**Request Body:**
```json
{
  "title": "Design UI mockups",
  "description": "Create high-fidelity mockups for all pages",
  "projectId": "63f7a2b8c9e8d7e6f5g4h3i3",
  "assignedTo": "63f7a3b8c9e8d7e6f5g4h3i4",
  "priority": "High",
  "dueDate": "2024-02-10"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a4b8c9e8d7e6f5g4h3i5",
    "title": "Design UI mockups",
    "description": "Create high-fidelity mockups for all pages",
    "project": { "_id": "63f7a2b8c9e8d7e6f5g4h3i3", "name": "E-Commerce Platform" },
    "assignedTo": { "_id": "63f7a3b8c9e8d7e6f5g4h3i4", "name": "Jane Smith" },
    "assignedBy": { "_id": "63f7a1b8c9e8d7e6f5g4h3i2", "name": "John Doe" },
    "status": "Pending",
    "priority": "High",
    "dueDate": "2024-02-10T00:00:00Z",
    "createdAt": "2024-01-20T10:30:00Z"
  }
}
```

---

#### 2. Get Project Tasks
- **URL:** `/tasks/project/:projectId`
- **Method:** `GET`
- **Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "63f7a4b8c9e8d7e6f5g4h3i5",
      "title": "Design UI mockups",
      "status": "In Progress",
      "priority": "High",
      "assignedTo": { "_id": "63f7a3b8c9e8d7e6f5g4h3i4", "name": "Jane Smith" },
      "dueDate": "2024-02-10T00:00:00Z"
    }
  ]
}
```

---

#### 3. Get My Tasks
- **URL:** `/tasks/my-tasks`
- **Method:** `GET`
- **Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "63f7a4b8c9e8d7e6f5g4h3i5",
      "title": "Design UI mockups",
      "project": { "_id": "63f7a2b8c9e8d7e6f5g4h3i3", "name": "E-Commerce Platform" },
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2024-02-10T00:00:00Z"
    }
  ]
}
```

---

#### 4. Update Task
- **URL:** `/tasks/:id`
- **Method:** `PUT`
- **Auth:** Required (Assigned user or project owner)

**Request Body:**
```json
{
  "status": "Completed",
  "priority": "Medium"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a4b8c9e8d7e6f5g4h3i5",
    "title": "Design UI mockups",
    "status": "Completed",
    "priority": "Medium",
    "completedAt": "2024-01-20T11:30:00Z",
    "updatedAt": "2024-01-20T11:30:00Z"
  }
}
```

---

#### 5. Delete Task
- **URL:** `/tasks/:id`
- **Method:** `DELETE`
- **Auth:** Required (Task creator only)

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted"
}
```

---

#### 6. Add Comment to Task
- **URL:** `/tasks/:id/comments`
- **Method:** `POST`
- **Auth:** Required

**Request Body:**
```json
{
  "text": "Started working on the design mockups"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "63f7a4b8c9e8d7e6f5g4h3i5",
    "comments": [
      {
        "user": { "_id": "63f7a3b8c9e8d7e6f5g4h3i4", "name": "Jane Smith" },
        "text": "Started working on the design mockups",
        "createdAt": "2024-01-20T11:30:00Z"
      }
    ]
  }
}
```

---

#### 7. Get Dashboard Stats
- **URL:** `/tasks/dashboard/stats`
- **Method:** `GET`
- **Auth:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 15,
    "completed": 8,
    "pending": 4,
    "inProgress": 3,
    "overdue": 2,
    "tasksByStatus": {
      "Pending": 4,
      "In Progress": 3,
      "Completed": 8,
      "On Hold": 0
    },
    "tasksByPriority": {
      "Low": 2,
      "Medium": 5,
      "High": 6,
      "Critical": 2
    }
  }
}
```

---

## 🔍 Error Responses

### 400 - Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Project name is required",
      "param": "name"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 - Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this project"
}
```

### 404 - Not Found
```json
{
  "success": false,
  "message": "Project not found"
}
```

### 500 - Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📊 Status Values

### Project Status
- `Active` - Project is in progress
- `Archived` - Project is archived
- `Completed` - Project is completed

### Task Status
- `Pending` - Task not started
- `In Progress` - Task is being worked on
- `Completed` - Task is finished
- `On Hold` - Task is paused

### Priority Levels
- `Low` - Low priority
- `Medium` - Medium priority
- `High` - High priority
- `Critical` - Critical priority (Tasks only)

### User Roles
- `Member` - Regular team member with limited access
- `Admin` - Administrator with full project access

---

## 🔐 Permission Rules

| Action | Owner | Member | Non-Member |
|--------|-------|--------|-----------|
| View Project | ✅ | ✅ | ❌ |
| Edit Project | ✅ | ❌ | ❌ |
| Delete Project | ✅ | ❌ | ❌ |
| Add Member | ✅ | ❌ | ❌ |
| Remove Member | ✅ | ❌ | ❌ |
| Create Task | ✅ | ✅ | ❌ |
| View Task | ✅ | ✅ | ❌ |
| Edit Task | ✅ | ✅* | ❌ |
| Delete Task | Task Creator | ❌ | ❌ |
| Add Comment | ✅ | ✅ | ❌ |

*Member can only edit tasks assigned to them

---

## 📝 Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## 🧪 Testing with Curl/Postman

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Example: Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"My Project",
    "startDate":"2024-01-20",
    "endDate":"2024-03-20"
  }'
```

---

**API Version:** 1.0  
**Last Updated:** January 2024  
**Contact:** For API support, check the README.md file
