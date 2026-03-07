# 🎓 Education Platform Backend

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2+-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3+-E83524?style=flat-square)](https://typeorm.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

**A production-ready RESTful API for comprehensive educational institution management**

[Features](#-features) • [Tech Stack](#-technology-stack) • [Installation](#-installation--setup) • [API Docs](./docs/api_docs.md) • [Architecture](#-system-architecture)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Database Schema](#-database-schema)
- [Installation & Setup](#-installation--setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](./docs/api_docs.md)
- [Docker Deployment](#-docker-deployment)
- [Database Seeding](#-database-seeding)
- [Project Structure](#-project-structure)
- [Development Guidelines](#-development-guidelines)
- [Performance Optimization](./docs/query_performance_benchmark.md)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [Branching Strategy](#-branching-strategy)

---

## 🎯 Overview

The **Education Platform Backend** is an enterprise-grade RESTful API system designed for managing educational institutions, students, courses, and academic results. Built with modern TypeScript and following industry best practices, this platform provides a scalable, secure, and maintainable solution for educational data management.

### Key Highlights

- **🔐 Secure Authentication**: JWT-based authentication with refresh token rotation
- **📊 Scalable Architecture**: Modular design with TypeORM and PostgreSQL
- **⚡ High Performance**: Optimized with database indexing for handling 100K+ records
- **✅ Type-Safe**: Full TypeScript coverage with strict mode enabled
- **🐳 Containerized**: Docker-ready with multi-stage builds
- **📝 Validated**: Zod schema validation for request/response integrity
- **🔄 RESTful Design**: Clean API architecture following REST principles


---

## ✨ Features

### Core Functionality

- ✅ **User Authentication & Authorization**
  - Secure user registration and login
  - JWT access tokens with automatic expiration
  - Refresh token mechanism for session management
  - Role-based access control (RBAC)
  - Secure password hashing with bcrypt

- ✅ **Institute Management**
  - CRUD operations for educational institutes
  - Multi-institute support with isolation
  - Status management (active/inactive)

- ✅ **Student Management**
  - Institute association and enrollment tracking
  - Email-based unique identification
  - Demographic information management
  - Enrollment year tracking

- ✅ **Course Management**
  - Course catalog administration
  - Unique course codes
  - Credit system management
  - Course metadata tracking

- ✅ **Results & Grading System**
  - Academic result tracking per student/course
  - Score and grade management
  - Academic year-based organization
  - Unique constraint per student-course-year combination
  - Result filtering and querying

### Technical Features

- 🔄 **Pagination**: Efficient data retrieval with customizable page sizes
- 🔍 **Advanced Filtering**: Multi-parameter query support
- 📊 **Database Indexing**: Optimized queries with strategic indexes
- 🛡️ **Input Validation**: Zod schemas for all API endpoints
- 🔐 **Security Headers**: Helmet.js for enhanced security
- 🌐 **CORS Support**: Configurable cross-origin resource sharing
<!-- - 📝 **Error Handling**: Centralized error management -->


---

## 🚀 Technology Stack

### Backend Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| **TypeScript** | 5.9+ | Type-safe development with strict mode |
| **Node.js** | 24+ | JavaScript runtime environment |
| **Express.js** | 5.2+ | Web application framework |

### Database & ORM
| Technology | Version | Purpose |
|-----------|---------|---------|
| **PostgreSQL** | 16+ | Primary relational database |
| **TypeORM** | 0.3+ | Object-Relational Mapping |
| **Reflect Metadata** | 0.2+ | Decorator metadata support |

### Security & Authentication
| Technology | Version | Purpose |
|-----------|---------|---------|
| **jsonwebtoken** | 9.0+ | JWT token generation/verification |
| **bcrypt** | 6.0+ | Password hashing and comparison |
| **Helmet** | 8.1+ | Security headers middleware |
| **CORS** | 2.8+ | Cross-origin resource sharing |

### Validation & Configuration
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Zod** | 4.3+ | Schema validation library |
| **dotenv** | 17.3+ | Environment variable management |
| **cookie-parser** | 1.4+ | Cookie parsing middleware |

### Development Tools
| Technology | Version | Purpose |
|-----------|---------|---------|
| **tsx** | 4.21+ | TypeScript execution & hot reload |
| **Docker** | Latest | Containerization platform |
| **pgAdmin** | Latest | PostgreSQL administration |

---

## 🏗️ System Architecture

### Architectural Pattern

This application follows a **modular monolithic architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                        │
│           (Frontend Apps, Mobile Apps, etc.)            │
└─────────────────────────────┬───────────────────────────┘
                              │  HTTP/HTTPS
┌─────────────────────────────▼───────────────────────────┐
│                   API Gateway Layer                     │
│              (Express.js + Middleware)                  │
│  ┌──────────┬──────────┬──────────┬───────────────────┐ │
│  │  Helmet  │   CORS   │  Auth    │   Validation      │ │
│  └──────────┴──────────┴──────────┴───────────────────┘ │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                 Business Logic Layer                      │
│                  (Service Modules)                        │
│  ┌──────────┬──────────┬──────────┬────────────┬────────┐ │
│  │  Auth    │ Students │ Courses  │ Institutes │ Results│ │
│  │ Service  │ Service  │ Service  │ Service    │ Service│ │
│  └──────────┴──────────┴──────────┴────────────┴────────┘ │
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                  Data Access Layer                      │
│              (Sequelize / TypeORM Repositories)         │
└─────────────────────────────┬───────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────┐
│                     Database Layer                      │
│                     (PostgreSQL 16)                     │
└─────────────────────────────────────────────────────────┘
```

### Module Structure

Each module follows a consistent pattern:

```
module/
├── Entity.ts       # Database entity with TypeORM decorators
├── Service.ts      # Business logic and data operations
├── Controller.ts   # Request handling and response formatting
├── Routes.ts       # API endpoint definitions
└── Schema.ts       # Zod validation schemas
```

### Request Flow

1. **Request Reception**: Express receives HTTP request
2. **Security Layer**: Helmet applies security headers
3. **CORS Handling**: CORS middleware validates origin
4. **Authentication**: JWT token verification (protected routes)
5. **Validation**: Zod schema validates request payload
6. **Business Logic**: Service layer processes request
7. **Data Access**: TypeORM interacts with PostgreSQL
8. **Response**: JSON response sent to client

---

## 💾 Database Schema

### Entity Relationship Diagram

![Architecture Diagram](https://res.cloudinary.com/deibsq1hv/image/upload/v1772880994/Recording_2026-03-07_160408_otbid5.gif)


### Database Indexes

**Strategic indexes for performance optimization:**

#### Institutes
- `idx_institute_name` - Fast name lookup
- `idx_institute_city` - City-based filtering
- `idx_institute_established_year` - Year-based queries
- `idx_institute_created` - Chronological sorting

#### Students
- `idx_student_email` - Email-based authentication
- `idx_student_institute` - Institute association queries
- `idx_student_enrollment_year` - Year-based filtering
- `idx_student_created` - Chronological sorting

#### Courses
- `idx_course_code` - Fast code lookup
- `idx_course_name` - Name-based searching
- `idx_course_created` - Chronological sorting

#### Results
- `idx_result_student` - Student result queries
- `idx_result_course` - Course result queries
- `idx_result_year` - Academic year filtering
- `idx_result_student_year` - Combined student-year queries
- `idx_result_course_year` - Combined course-year queries
- `idx_result_created` - Chronological sorting

---

## 🛠️ Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 24.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 12.x or higher ([Download](https://www.postgresql.org/download/))
- **npm** 10.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/downloads))
- **Docker** (optional, for containerized deployment)

### Step 1: Clone the Repository

```bash
git clone https://github.com/md-zihad/Education-Platform-Backend.git
cd Education-Platform-Backend
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`.

### Step 3: Database Setup

#### Option A: Local PostgreSQL

1. Create a PostgreSQL database:
```sql
CREATE DATABASE education_platform;
```

2. The application will automatically create tables on first run using TypeORM synchronization.

#### Option B: Docker PostgreSQL (Recommended)

The project includes Docker Compose configuration:

```bash
cd docker
docker-compose up -d postgres
```

### Step 4: Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#-configuration) section below).

### Step 5: Verify Installation

```bash
npm run dev
```

If successful, you should see:
```
Database connected
Server running on port 5000
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```bash
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_secure_password
DB_NAME=education_platform

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES_IN=900              # 15 minutes in seconds
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_characters
JWT_REFRESH_EXPIRES=604800      # 7 days in seconds

# pgAdmin Configuration (for Docker)
PGADMIN_DEFAULT_EMAIL=admin@education.com
PGADMIN_DEFAULT_PASSWORD=admin_password
```

### Configuration Guidelines

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | number | 5000 | Server port number |
| `DB_HOST` | string | localhost | PostgreSQL host address |
| `DB_PORT` | number | 5432 | PostgreSQL port |
| `DB_USER` | string | postgres | Database username |
| `DB_PASS` | string | - | Database password |
| `DB_NAME` | string | - | Database name |
| `JWT_SECRET` | string | - | Secret key for access tokens (min 32 chars) |
| `JWT_EXPIRES_IN` | number | 900 | Access token expiry in seconds |
| `JWT_REFRESH_SECRET` | string | - | Secret key for refresh tokens (min 32 chars) |
| `JWT_REFRESH_EXPIRES` | number | 604800 | Refresh token expiry in seconds |

**Security Notes:**
- Never commit `.env` file to version control
- Use strong, random strings for JWT secrets (min 32 characters)
- Use different secrets for production environment
- Regularly rotate JWT secrets in production

---

## 🚀 Running the Application

### Development Mode

Starts the server with hot-reload enabled:

```bash
npm run dev
```

The server will automatically restart when you make changes to the source code.

### Production Build

1. **Build the TypeScript code:**
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

2. **Start the production server:**
```bash
npm start
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Development** | `npm run dev` | Start development server with hot-reload |
| **Build** | `npm run build` | Compile TypeScript to JavaScript |
| **Production** | `npm start` | Start production server |

### Health Check

Once the server is running, verify it's working:

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK"
}
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

The project includes three Docker Compose configurations:

#### 1. Development Environment

```bash
cd docker
docker-compose -f docker-compose.dev.yml up
```

**Services:**
- Application (with hot-reload)
- PostgreSQL database
- pgAdmin web interface

#### 2. Production Environment

```bash
cd docker
docker-compose -f docker-compose.yml up -d
```

**Services:**
- Application (optimized build)
- PostgreSQL database
- pgAdmin web interface

**Features:**
- Multi-stage Docker builds
- Optimized image size
- Health checks
- Automatic restarts
- Volume persistence

### Accessing Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | http://localhost:5000 | N/A |
| **pgAdmin** | http://localhost:5050 | See `.env` |
| **PostgreSQL** | localhost:5432 | See `.env` |

### Individual Container Commands

#### Build Custom Image

```bash
docker build -f docker/Dockerfile.prod -t education-platform-backend .
```

#### Run Container

```bash
docker run -d \
  --name education-api \
  -p 5000:5000 \
  --env-file .env \
  education-platform-backend
```

#### View Logs

```bash
docker-compose logs -f app
```

#### Stop Services

```bash
docker-compose down
```

#### Stop and Remove Volumes

```bash
docker-compose down -v
```

---

## 📊 Database Seeding

The project includes SQL scripts for seeding large datasets to test performance with realistic data volumes.

### Seed Scripts Location

```
scripts/
├── institute.sql    # Seed 100,000 institutes
├── student.sql      # Seed 100,000 students
├── course.sql       # Seed 100,000 courses
└── result.sql       # Seed 100,000 results
```

### Running Seed Scripts

#### Method 1: Using psql

```bash
psql -U postgres -d education_platform -f scripts/institute.sql
psql -U postgres -d education_platform -f scripts/student.sql
psql -U postgres -d education_platform -f scripts/course.sql
psql -U postgres -d education_platform -f scripts/result.sql
```

#### Method 2: Using pgAdmin

1. Connect to your database
2. Open Query Tool
3. Load and execute each script

#### Method 3: Using Docker

```bash
docker exec -i postgres_container psql -U postgres -d education_platform < scripts/institute.sql
```

### Seed Data Characteristics

- **100,000 records** per table
- **Realistic data** with random but valid values
- **Foreign key relationships** properly maintained
- **Performance testing** ready for database indexing verification

**Note:** Seeding all tables may take several minutes depending on your hardware.

---

## 📁 Project Structure

```
Education-Platform-Backend/
│
├── src/                          # Source code
│   ├── app.ts                   # Express application configuration
│   ├── server.ts                # Server entry point
│   ├── routes.ts                # Main route aggregator
│   │
│   ├── config/                  # Configuration files
│   │   ├── database.ts         # TypeORM database configuration
│   │   └── env.ts              # Environment variables setup
│   │
│   ├── middleware/             # Custom middleware
│   │   ├── auth.middleware.ts # JWT authentication middleware
│   │   └── validate.middleware.ts # Zod validation middleware
│   │
│   ├── modules/                # Feature modules
│   │   │
│   │   ├── auth/              # Authentication module
│   │   │   ├── Auth.controller.ts
│   │   │   ├── Auth.routes.ts
│   │   │   ├── Auth.schema.ts
│   │   │   └── Auth.service.ts
│   │   │
│   │   ├── institutes/        # Institute management
│   │   │   ├── Institute.controller.ts
│   │   │   ├── Institute.entity.ts
│   │   │   ├── Institute.routes.ts
│   │   │   ├── Institute.schema.ts
│   │   │   └── Institute.service.ts
│   │   │
│   │   ├── students/          # Student management
│   │   │   ├── Student.controller.ts
│   │   │   ├── Student.entity.ts
│   │   │   ├── Student.routes.ts
│   │   │   ├── Student.schema.ts
│   │   │   └── Student.service.ts
│   │   │
│   │   ├── courses/           # Course management
│   │   │   ├── Course.controller.ts
│   │   │   ├── Course.entity.ts
│   │   │   ├── Course.routes.ts
│   │   │   ├── Course.schema.ts
│   │   │   └── Course.service.ts
│   │   │
│   │   ├── results/           # Results management
│   │   │   ├── Result.controller.ts
│   │   │   ├── Result.entity.ts
│   │   │   ├── Result.routes.ts
│   │   │   ├── Result.schema.ts
│   │   │   └── Result.service.ts
│   │   │
│   │   └── user/             # User entity
│   │       └── User.entity.ts
│   │
│   └── utils/                # Utility functions
│       └── jwt.ts           # JWT helper functions
│
├── docker/                   # Docker configuration
│   ├── docker-compose.yml   # Production compose file
│   ├── docker-compose.dev.yml # Development compose file
│   ├── Dockerfile           # Main Dockerfile
│   ├── Dockerfile.dev       # Development Dockerfile
│   └── Dockerfile.prod      # Production Dockerfile
│
├── scripts/                 # Database seed scripts
│   ├── institute.sql
│   ├── student.sql
│   ├── course.sql
│   └── result.sql
│
├── .env.example            # Environment variables template
├── .gitignore             # Git ignore rules
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

**Layer Responsibilities:**

1. **Entity**: Database schema, relationships, and decorators
2. **Service**: Core business logic and data operations
3. **Controller**: HTTP request/response handling
4. **Routes**: Endpoint definitions and middleware attachment
5. **Schema**: Input/output validation rules

---

## 🛠️ Development Guidelines

### Code Style

- Follow **TypeScript strict mode** conventions
- Use **ESM (ES Modules)** syntax
- Apply **async/await** for asynchronous operations
- Implement **proper error handling** with try-catch blocks
- Write **descriptive variable and function names**

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Files** | PascalCase | `Student.entity.ts` |
| **Variables** | camelCase | `studentData` |
| **Constants** | UPPER_SNAKE_CASE | `JWT_SECRET` |
| **Classes** | PascalCase | `StudentService` |
| **Interfaces** | PascalCase with I prefix | `IStudentData` |
| **Functions** | camelCase | `createStudent()` |

---

## 🔒 Security Features

### Implemented Security Measures

1. **Password Security**
   - Bcrypt hashing with salt rounds (12)
   - No plain-text password storage
   - Secure password comparison

2. **JWT Security**
   - Short-lived access tokens (15 minutes)
   - Refresh token rotation
   - Secure token storage (hashed in database)
   - Token expiration enforcement

3. **HTTP Security**
   - Helmet.js security headers
   - CORS configuration
   - Request size limiting (10KB JSON payload)
   - Cookie parsing security

4. **Input Validation**
   - Zod schema validation
   - SQL injection prevention (TypeORM parameterized queries)
   - XSS protection through sanitization

5. **Database Security**
   - Environment-based credentials
   - Connection pooling
   - Prepared statements

### Security Best Practices

```typescript
// ✅ Good: Hashed password
const hashedPassword = await bcrypt.hash(password, 12);

// ❌ Bad: Plain text password
const password = "plaintext";
```

```typescript
// ✅ Good: Parameterized query (TypeORM handles this)
repo.findOne({ where: { email } });

// ❌ Bad: String concatenation (vulnerable to SQL injection)
repo.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 🧪 Testing


### Testing with Postman

***[Download Postman Collection](./postman/Education-Platform-API.postman_collection.json)***

1. Import the API endpoints into Postman
2. Set up environment variables for `baseUrl` and `accessToken`
3. Use Collection Runner for sequential tests

---

## 🌿 Branching Strategy

This project follows a **GitFlow-inspired branching strategy** to keep development organized, reduce integration risk, and maintain release quality.

```
          ┌─────────────┐
          │   main      │
          │ (production)│
          └─────┬───────┘
                │
                │
         ┌──────▼────────┐
         │   develop     │
         │ (integration) │
         └──────┬────────┘
   ┌────────────┼─────────────┐
   │            │             │
   │            │             │
┌──▼────┐   ┌───▼─────┐    ┌──▼───┐
│feature│   │feature  │    │hotfix│
│/login │   │/students│    │/patch│
└───────┘   └─────────┘    └──────┘
```

### Branch Model

- `main`: Stable production-ready code only.
- `dev`: Primary integration branch for ongoing development.
- `feature/*`: New features and enhancements (for example `feature/result`).
- `hotfix/*`: Urgent production fixes.
- `release/*`: Pre-release stabilization, versioning, and final QA.

### Why This Strategy

- **Predictable releases**: Separates active development from production-ready code.
- **Safer collaboration**: Multiple contributors can work in parallel without destabilizing core branches.
- **Clean history and traceability**: Feature branches map directly to units of work and PRs.
- **Faster incident response**: Hotfix branches allow urgent production patches with minimal disruption.
- **Better code quality**: Structured PR flow into `dev` and `main` supports review, testing, and release governance.

### Recommended Workflow

1. Branch from `dev`: `feature/<short-description>`
2. Implement changes and commit using Conventional Commits.
3. Open PR to `dev` and complete code review.
4. Merge to `dev` after checks pass.
5. Create `release/*` branch when preparing a release.
6. Merge tested release to `main`, then back-merge to `dev`.

### Naming Convention

- `feature/auth-refresh-token`
- `feature/result-filtering`
- `hotfix/jwt-expiry-validation`
- `release/v1.1.0`

---


### Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Code Review Process

- All PRs require review before merging
- Ensure all tests pass
- Follow existing code style
- Update documentation as needed

---


## 📚 Additional Resources

- [TypeORM Documentation](https://typeorm.io/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [REST API Design Guide](https://restfulapi.net/)

---

## 📊 Project Stats

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Lines of Code:** ~2000+
- **Modules:** 5 (Auth, Institutes, Students, Courses, Results)
- **API Endpoints:** 25+ REST endpoints

---

## 👤 Author

**Md. Zihad**

- GitHub: [@md-zihad](https://github.com/md-zihad)
- Repository: [Education-Platform-Backend](https://github.com/md-zihad/Education-Platform-Backend)
