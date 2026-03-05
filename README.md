# 🎓 Education Platform Backend

> A comprehensive educational management system backend built with TypeScript, Express.js, and PostgreSQL. Designed for managing students, courses, institutes, and results with robust authentication and data validation.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2+-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3+-E83524?style=flat-square)](https://typeorm.io/)

## 🏗️ Architecture Overview

This project implements a modular education management system with the following key components:

- **Authentication Module**: JWT-based user authentication with bcrypt password hashing
- **Student Management**: Student registration, profiles, and academic tracking
- **Course Management**: Course creation, enrollment, and curriculum management
- **Institute Management**: Multi-tenant institute administration
- **Results System**: Grade management and academic performance tracking
- **Data Layer**: TypeORM with PostgreSQL for robust data persistence

## 🚀 Tech Stack

### Backend Framework
- **TypeScript 5.9+** - Type-safe development
- **Node.js 24+** - Runtime environment
- **Express.js 5.2** - Web application framework

### Database & ORM
- **PostgreSQL** - Primary database
- **TypeORM 0.3** - Object-Relational Mapping
- **Reflect Metadata** - Decorator support

### Security & Authentication
- **JWT (JSON Web Tokens)** - Authentication
- **bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Development Tools
- **tsx** - TypeScript execution and hot reload
- **Zod** - Schema validation
- **dotenv** - Environment configuration

## 📁 Project Structure

```
src/
├── app.ts                 # Express application setup
├── server.ts             # Server entry point
├── routes.ts             # Main routing configuration
├── config/
│   ├── database.ts       # TypeORM database configuration
│   └── env.ts            # Environment variables
├── middleware/           # Custom middleware functions
├── modules/              # Feature modules
│   ├── auth/            # Authentication & authorization
│   ├── courses/         # Course management
│   ├── institutes/      # Institute administration
│   ├── results/         # Academic results & grades
│   └── students/        # Student management
└── utils/               # Utility functions
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 24+ 
- PostgreSQL 12+
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/md-zihad/Education-Platform-Backend.git
cd Education-Platform-Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=student_db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h
```

### 4. Database Setup
Create the PostgreSQL database:
```sql
CREATE DATABASE student_db;
```

### 5. Run the application

#### Development Mode
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm start
```

## 🧪 Development Scripts

```bash
# Development with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 👨‍💻 Author

**Md. Zihad**
- GitHub: [@md-zihad](https://github.com/md-zihad)
