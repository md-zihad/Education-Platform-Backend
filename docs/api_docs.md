## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

Most endpoints require authentication using JWT Bearer tokens:

```http
Authorization: Bearer <your_access_token>
```

---

### 🔐 Authentication Endpoints

#### Register New User

```http
POST /api/auth/signup
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "ADMIN",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Validation Rules:**
- Email must be valid format
- Password minimum 8 characters

---

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token Lifetime:**
- Access Token: 15 minutes (configurable)
- Refresh Token: 7 days (configurable)

---

#### Refresh Token

```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

#### Logout

```http
POST /api/auth/logout
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "message": "Logout successful"
}
```

---

### 🏫 Institute Endpoints

#### Create Institute

```http
POST /api/institutes/create
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Massachusetts Institute of Technology",
  "establishedYear": 1861,
  "city": "Cambridge",
  "country": "USA",
  "status": true
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Massachusetts Institute of Technology",
  "establishedYear": 1861,
  "city": "Cambridge",
  "country": "USA",
  "status": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### Get All Institutes

```http
GET /api/institutes?page=1&limit=10
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "MIT",
      "establishedYear": 1861,
      "city": "Cambridge",
      "country": "USA",
      "status": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

#### Get Institute by ID

```http
GET /api/institutes/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "MIT",
  "establishedYear": 1861,
  "city": "Cambridge",
  "country": "USA",
  "status": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### Update Institute

```http
PUT /api/institutes/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Massachusetts Institute of Technology (Updated)",
  "city": "Cambridge",
  "status": false
}
```

**Response:** `200 OK`

---

#### Delete Institute

```http
DELETE /api/institutes/:id
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Response:** `204 No Content`

---

### 👨‍🎓 Student Endpoints

#### Create Student

```http
POST /api/students/create
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "gender": "Male",
  "instituteId": "uuid",
  "enrollmentYear": 2023
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "age": 20,
  "gender": "Male",
  "enrollmentYear": 2023,
  "institute": {
    "id": "uuid",
    "name": "MIT"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### Get All Students

```http
GET /api/students?page=1&limit=10
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 20,
      "gender": "Male",
      "enrollmentYear": 2023,
      "institute": {
        "id": "uuid",
        "name": "MIT"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

#### Get Student by ID

```http
GET /api/students/:id
```

**Response:** `200 OK` (Returns single student with institute details)

---

#### Update Student

```http
PUT /api/students/:id
```

**Request Body:** (Partial update supported)
```json
{
  "age": 21,
  "enrollmentYear": 2024
}
```

---

#### Delete Student

```http
DELETE /api/students/:id
```

**Response:** `204 No Content`

---

### 📚 Course Endpoints

#### Create Course

```http
POST /api/courses/create
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "credits": 3
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Introduction to Computer Science",
  "code": "CS101",
  "credits": 3,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

#### Get All Courses

```http
GET /api/courses?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:** `200 OK` (Paginated list of courses)

---

#### Get Course by ID

```http
GET /api/courses/:id
```

**Response:** `200 OK`

---

#### Update Course

```http
PUT /api/courses/:id
```

**Request Body:**
```json
{
  "name": "Advanced Computer Science",
  "credits": 4
}
```

---

#### Delete Course

```http
DELETE /api/courses/:id
```

**Response:** `204 No Content`

---

### 📊 Result Endpoints

#### Create Result

```http
POST /api/results/create
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "studentId": "uuid",
  "courseId": "uuid",
  "score": 85.5,
  "grade": "A",
  "academicYear": 2024
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "score": 85.5,
  "grade": "A",
  "academicYear": 2024,
  "student": {
    "id": "uuid",
    "name": "John Doe"
  },
  "course": {
    "id": "uuid",
    "name": "CS101",
    "code": "CS101"
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Constraints:**
- Unique combination of (studentId, courseId, academicYear)
- Score must be between 0 and 100

---

#### Get All Results

```http
GET /api/results?page=1&limit=10&studentId=uuid&courseId=uuid&academicYear=2024
```

**Headers:**
```http
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `studentId` (optional): Filter by student ID
- `courseId` (optional): Filter by course ID
- `academicYear` (optional): Filter by academic year

**Response:** `200 OK`
```json
{
  "data": [
    {
      "id": "uuid",
      "score": 85.5,
      "grade": "A",
      "academicYear": 2024,
      "student": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "course": {
        "id": "uuid",
        "name": "Introduction to Computer Science",
        "code": "CS101"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

#### Get Result by ID

```http
GET /api/results/:id
```

**Response:** `200 OK`

---

#### Update Result

```http
PUT /api/results/:id
```

**Request Body:**
```json
{
  "score": 90.0,
  "grade": "A+"
}
```

---

#### Delete Result

```http
DELETE /api/results/:id
```

**Response:** `204 No Content`

---

### Error Responses

All endpoints may return the following error responses:

#### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

#### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

#### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```
