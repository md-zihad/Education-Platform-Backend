# Database Schema Design Specification

## 1. Document Purpose

This document serves as the authoritative reference for the database schema implementation in the Education Platform Backend system. It provides detailed specifications of table structures, relationships, constraints, indexing strategies, and the mapping between TypeORM entity definitions and the underlying PostgreSQL database schema.


---

## 2. Schema Management Strategy

### 2.1 ORM-Driven Development Approach

This project utilizes **TypeORM** (Object-Relational Mapping) as the primary data access layer. The schema is defined declaratively through TypeScript decorators in entity classes, enabling:

- **Type-safe database operations** with compile-time validation
- **Automatic schema synchronization** during development
- **Abstraction of database-specific syntax** across different database engines
- **Entity relationship management** through object-oriented programming patterns

### 2.2 TypeORM Entity Architecture

Entity definitions reside in `src/modules/*/Entity.ts` files and follow this pattern:

```typescript
@Entity("table_name")
@Index("idx_field", ["field"])
export class EntityName {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ type: "varchar", unique: true })
    field: string;
    
    @CreateDateColumn()
    createdAt: Date;
}
```

### 2.3 Schema Synchronization

**Development Mode:**
- TypeORM `synchronize: true` automatically creates/updates schema based on entity definitions
- Changes to entity decorators trigger automatic schema migrations
- Enables rapid development without manual DDL operations

**Production Mode (Recommended):**
- Disable `synchronize: true` to prevent automatic schema changes
- Use TypeORM CLI migrations: `typeorm migration:generate`
- Apply migrations via `typeorm migration:run`
- Maintains full control and audit trail of schema changes

### 2.4 SQL Schema Representation

The SQL definitions presented below represent the **compiled schema** generated from TypeORM entities. These are provided for:

- Understanding the physical database structure
- Database performance analysis and optimization
- Documentation and knowledge transfer

---

## 3. Entity Relationship Diagram

```
                        ┌──────────────────┐
                        │      Users       │
                        │  (Authentication)│
                        └──────────────────┘


     ┌───────────────────────────────────────────────────┐
     │                                                   │
     ▼                                                   ▼
┌─────────────┐                                   ┌─────────────┐
│ Institutes  │                                   │   Courses   │
│  (1)        │                                   │    (1)      │
└──────┬──────┘                                   └──────┬──────┘
       │                                                 │
       │ 1:N                                             │ 1:N
       │                                                 │
       ▼                                                 │
┌─────────────┐                                          │
│  Students   │                                          │
│   (N)       │                                          │ 
└──────┬──────┘                                          │
       │                                                 │
       │ N                                               │ N
       │                                                 │
       └──────────────────┬──────────────────────────────┘
                          ▼
                    ┌─────────────┐
                    │   Results   │
                    │ (Junction)  │
                    └─────────────┘
```

**Relationship Summary:**
- One Institute → Many Students
- One Student → Many Results
- One Course → Many Results
- Unique constraint: (Student, Course, Academic Year)

---

## 4. Table Specifications

### 4.1 Users Table

**Purpose:** Core authentication and authorization entity storing user credentials and role information.

**Entity Location:** `src/modules/user/User.entity.ts`

#### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS users
(
    id              UUID DEFAULT gen_random_uuid()          NOT NULL PRIMARY KEY,
    email           VARCHAR(255)                            NOT NULL UNIQUE,
    password        VARCHAR(255)                            NOT NULL,
    role            user_role DEFAULT 'ADMIN'               NOT NULL,
    refresh_token   VARCHAR(255)                            NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL
);

-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Field Specifications

| Field | Data Type | Constraints | TypeORM Decorator | Description |
|-------|-----------|-------------|-------------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL, DEFAULT | `@PrimaryGeneratedColumn("uuid")` | Universally unique identifier for user |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | `@Column({ unique: true })` | User email address for authentication |
| `password` | VARCHAR(255) | NOT NULL | `@Column()` | Bcrypt-hashed password (12 salt rounds) |
| `role` | ENUM | NOT NULL, DEFAULT 'ADMIN' | `@Column({ type: "enum", enum: UserRole })` | User role for authorization |
| `refresh_token` | VARCHAR(255) | NULL | `@Column({ nullable: true })` | Hashed JWT refresh token |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW | `@CreateDateColumn()` | Account creation timestamp |

#### Index Strategy

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_users_email` | `email` | Login queries | `WHERE email = ?` |
| `idx_users_role` | `role` | Role-based filtering | `WHERE role = ?` |

#### Constraints & Rules

- **Primary Key:** UUID ensures global uniqueness and prevents enumeration attacks
- **Unique Email:** Prevents duplicate accounts; enforced at database level
- **Password Storage:** Always bcrypt-hashed; never stored in plaintext
- **Refresh Token:** Hashed before storage for security (see JWT implementation doc)

---

### 4.2 Institutes Table

**Purpose:** Represents educational institutions within the platform architecture.

**Entity Location:** `src/modules/institutes/Institute.entity.ts`

#### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS institutes
(
    id                UUID DEFAULT gen_random_uuid()          NOT NULL PRIMARY KEY,
    name              VARCHAR(255)                            NOT NULL UNIQUE,
    established_year  INT                                     NOT NULL,
    city              VARCHAR(255)                            NULL,
    country           VARCHAR(255)                            NULL,
    status            BOOLEAN DEFAULT TRUE                    NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL
);

-- Performance indexes
CREATE INDEX idx_institute_name ON institutes(name);
CREATE INDEX idx_institute_city ON institutes(city);
CREATE INDEX idx_institute_established_year ON institutes(established_year);
CREATE INDEX idx_institute_created ON institutes(created_at);
```

#### Field Specifications

| Field | Data Type | Constraints | TypeORM Decorator | Description |
|-------|-----------|-------------|-------------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | `@PrimaryGeneratedColumn("uuid")` | Unique institute identifier |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | `@Column({ unique: true })` | Official institute name |
| `established_year` | INT | NOT NULL | `@Column({ type: "int" })` | Year of establishment |
| `city` | VARCHAR(255) | NULL | `@Column({ nullable: true })` | City location |
| `country` | VARCHAR(255) | NULL | `@Column({ nullable: true })` | Country location |
| `status` | BOOLEAN | NOT NULL, DEFAULT TRUE | `@Column({ default: true })` | Active/inactive flag |
| `created_at` | TIMESTAMP | NOT NULL | `@CreateDateColumn()` | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | `@UpdateDateColumn()` | Last modification timestamp |

#### Index Strategy

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_institute_name` | `name` | Name-based searches | `WHERE name LIKE ?` |
| `idx_institute_city` | `city` | Geographic filtering | `WHERE city = ?` |
| `idx_institute_established_year` | `established_year` | Temporal filtering | `WHERE established_year BETWEEN ? AND ?` |
| `idx_institute_created` | `created_at` | Chronological sorting | `ORDER BY created_at DESC` |

#### Constraints & Rules

- **Unique Name:** Prevents duplicate institute entries
- **Status Flag:** Enables soft deactivation without data deletion
- **Temporal Data:** Supports historical and year-based analytics

---

### 4.3 Students Table

**Purpose:** Maintains comprehensive student profiles and enrollment information.

**Entity Location:** `src/modules/students/Student.entity.ts`

#### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS students
(
    id                UUID DEFAULT gen_random_uuid()          NOT NULL PRIMARY KEY,
    name              VARCHAR(255)                            NOT NULL,
    email             VARCHAR(255)                            NOT NULL UNIQUE,
    age               INT                                     NULL,
    gender            VARCHAR(50)                             NULL,
    institute_id      UUID                                    NOT NULL,
    enrollment_year   INT                                     NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL,
    
    CONSTRAINT fk_students_institute 
        FOREIGN KEY (institute_id) 
        REFERENCES institutes(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE
);

-- Performance indexes
CREATE INDEX idx_student_email ON students(email);
CREATE INDEX idx_student_institute ON students(institute_id);
CREATE INDEX idx_student_enrollment_year ON students(enrollment_year);
CREATE INDEX idx_student_created ON students(created_at);
```

#### Field Specifications

| Field | Data Type | Constraints | TypeORM Decorator | Description |
|-------|-----------|-------------|-------------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | `@PrimaryGeneratedColumn("uuid")` | Unique student identifier |
| `name` | VARCHAR(255) | NOT NULL | `@Column()` | Student full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | `@Column({ unique: true })` | Student email address |
| `age` | INT | NULL | `@Column({ nullable: true })` | Student age |
| `gender` | VARCHAR(50) | NULL | `@Column({ nullable: true })` | Student gender |
| `institute_id` | UUID | NOT NULL, FOREIGN KEY | `@ManyToOne(() => Institute)` | Associated institute |
| `enrollment_year` | INT | NULL | `@Column({ nullable: true })` | Year of enrollment |
| `created_at` | TIMESTAMP | NOT NULL | `@CreateDateColumn()` | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | `@UpdateDateColumn()` | Last modification timestamp |

#### Relationships

```typescript
// TypeORM Relationship Definition
@ManyToOne(() => Institute, (institute) => institute.students)
@JoinColumn({ name: "institute_id" })
institute: Institute;
```

**Relationship Type:** Many-to-One  
**Cardinality:** N Students : 1 Institute  
**Delete Rule:** RESTRICT (prevents institute deletion if students exist)  
**Update Rule:** CASCADE (updates propagate to student records)

#### Index Strategy

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_student_email` | `email` | Email-based authentication | `WHERE email = ?` |
| `idx_student_institute` | `institute_id` | Institute-based queries | `WHERE institute_id = ?` |
| `idx_student_enrollment_year` | `enrollment_year` | Cohort analysis | `WHERE enrollment_year = ?` |
| `idx_student_created` | `created_at` | Chronological sorting | `ORDER BY created_at DESC` |

#### Constraints & Rules

- **Unique Email:** Ensures no duplicate student accounts
- **Foreign Key Integrity:** Prevents orphaned student records
- **ON DELETE RESTRICT:** Institute cannot be deleted if students exist
- **ON UPDATE CASCADE:** Institute ID changes propagate automatically

---

### 4.4 Courses Table

**Purpose:** Catalog of academic courses available across the platform.

**Entity Location:** `src/modules/courses/Course.entity.ts`

#### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS courses
(
    id          UUID DEFAULT gen_random_uuid()              NOT NULL PRIMARY KEY,
    name        VARCHAR(255)                                NOT NULL,
    code        VARCHAR(255)                                NOT NULL UNIQUE,
    credits     INT DEFAULT 3                               NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP         NOT NULL,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP         NOT NULL
);

-- Performance indexes
CREATE INDEX idx_course_code ON courses(code);
CREATE INDEX idx_course_name ON courses(name);
CREATE INDEX idx_course_created ON courses(created_at);
```

#### Field Specifications

| Field | Data Type | Constraints | TypeORM Decorator | Description |
|-------|-----------|-------------|-------------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | `@PrimaryGeneratedColumn("uuid")` | Unique course identifier |
| `name` | VARCHAR(255) | NOT NULL | `@Column()` | Full course name |
| `code` | VARCHAR(255) | NOT NULL, UNIQUE | `@Column({ unique: true })` | Course code (e.g., CS101) |
| `credits` | INT | NOT NULL, DEFAULT 3 | `@Column({ default: 3 })` | Credit hours |
| `created_at` | TIMESTAMP | NOT NULL | `@CreateDateColumn()` | Record creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL | `@UpdateDateColumn()` | Last modification timestamp |

#### Index Strategy

| Index Name | Columns | Purpose | Query Pattern |
|------------|---------|---------|---------------|
| `idx_course_code` | `code` | Course code lookup | `WHERE code = ?` |
| `idx_course_name` | `name` | Course name search | `WHERE name LIKE ?` |
| `idx_course_created` | `created_at` | Chronological sorting | `ORDER BY created_at DESC` |

#### Constraints & Rules

- **Unique Course Code:** Prevents duplicate course definitions
- **Default Credits:** Standard course weight is 3 credit hours
- **Name & Code:** Both required for course identification

---

### 4.5 Results Table

**Purpose:** Junction entity linking students to courses with academic performance data.

**Entity Location:** `src/modules/results/Result.entity.ts`


#### Schema Definition

```sql
CREATE TABLE IF NOT EXISTS results
(
    id              UUID DEFAULT gen_random_uuid()          NOT NULL PRIMARY KEY,
    student_id      UUID                                    NOT NULL,
    course_id       UUID                                    NOT NULL,
    score           NUMERIC(5,2)                            NOT NULL,
    grade           VARCHAR(5)                              NULL,
    academic_year   INT                                     NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP     NOT NULL,
    
    CONSTRAINT fk_results_student 
        FOREIGN KEY (student_id) 
        REFERENCES students(id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE,
        
    CONSTRAINT fk_results_course 
        FOREIGN KEY (course_id) 
        REFERENCES courses(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
        
    CONSTRAINT uq_student_course_year 
        UNIQUE (student_id, course_id, academic_year),
        
    CONSTRAINT chk_score_range 
        CHECK (score >= 0 AND score <= 100)
);

-- Performance indexes
CREATE INDEX idx_result_student ON results(student_id);
CREATE INDEX idx_result_course ON results(course_id);
CREATE INDEX idx_result_year ON results(academic_year);
CREATE INDEX idx_result_student_year ON results(student_id, academic_year);
CREATE INDEX idx_result_course_year ON results(course_id, academic_year);
CREATE INDEX idx_result_created ON results(created_at);
```

#### Field Specifications

| Field | Data Type | Constraints | TypeORM Decorator | Description |
|-------|-----------|-------------|-------------------|-------------|
| `id` | UUID | PRIMARY KEY, NOT NULL | `@PrimaryGeneratedColumn("uuid")` | Unique result identifier |
| `student_id` | UUID | NOT NULL, FOREIGN KEY | `@ManyToOne(() => Student)` | Reference to student |
| `course_id` | UUID | NOT NULL, FOREIGN KEY | `@ManyToOne(() => Course)` | Reference to course |
| `score` | NUMERIC(5,2) | NOT NULL, CHECK | `@Column({ type: "numeric", precision: 5, scale: 2 })` | Numerical score (0.00-100.00) |
| `grade` | VARCHAR(5) | NULL | `@Column({ nullable: true })` | Letter grade (A, B+, etc.) |
| `academic_year` | INT | NOT NULL | `@Column({ type: "int" })` | Academic year |
| `created_at` | TIMESTAMP | NOT NULL | `@CreateDateColumn()` | Record creation timestamp |

#### Relationships

```typescript
// TypeORM Relationship Definitions
@ManyToOne(() => Student)
@JoinColumn({ name: "student_id" })
student: Student;

@ManyToOne(() => Course)
@JoinColumn({ name: "course_id" })
course: Course;

@Unique(["student", "course", "academicYear"])
```

**Student Relationship:**
- Type: Many-to-One
- Delete Rule: CASCADE (results deleted when student is deleted)
- Update Rule: CASCADE

**Course Relationship:**
- Type: Many-to-One
- Delete Rule: RESTRICT (prevents course deletion if results exist)
- Update Rule: CASCADE

#### Index Strategy

| Index Name | Columns | Purpose | Query Pattern | Type |
|------------|---------|---------|---------------|------|
| `idx_result_student` | `student_id` | Student transcript queries | `WHERE student_id = ?` | Single-column |
| `idx_result_course` | `course_id` | Course performance analytics | `WHERE course_id = ?` | Single-column |
| `idx_result_year` | `academic_year` | Year-based reporting | `WHERE academic_year = ?` | Single-column |
| `idx_result_student_year` | `student_id, academic_year` | Student annual performance | `WHERE student_id = ? AND academic_year = ?` | Composite |
| `idx_result_course_year` | `course_id, academic_year` | Course annual statistics | `WHERE course_id = ? AND academic_year = ?` | Composite |
| `idx_result_created` | `created_at` | Chronological sorting | `ORDER BY created_at DESC` | Single-column |

#### Constraints & Rules

**Unique Constraint (`uq_student_course_year`):**
- Prevents duplicate grade entries for same student-course-year combination
- Enforced at database level for data integrity
- TypeORM: `@Unique(["student", "course", "academicYear"])`

**Check Constraint (`chk_score_range`):**
- Validates score is between 0 and 100
- Ensures data quality at database level
- Catches invalid data before persistence

---

## 5. TypeORM to SQL Translation Reference

### 5.1 Decorator Mapping

| TypeORM Decorator | SQL Equivalent | Example |
|-------------------|----------------|---------|
| `@Entity("table")` | `CREATE TABLE table` | Table creation |
| `@PrimaryGeneratedColumn("uuid")` | `UUID PRIMARY KEY DEFAULT gen_random_uuid()` | Primary key |
| `@Column()` | Column definition | Field creation |
| `@Column({ unique: true })` | `UNIQUE` constraint | Uniqueness |
| `@Column({ nullable: true })` | `NULL` | Optional field |
| `@Column({ default: value })` | `DEFAULT value` | Default value |
| `@CreateDateColumn()` | `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | Auto timestamp |
| `@UpdateDateColumn()` | `TIMESTAMP` with trigger | Auto update |
| `@Index("name", ["field"])` | `CREATE INDEX name ON table(field)` | Index creation |
| `@ManyToOne()` | `FOREIGN KEY` | Foreign key |
| `@JoinColumn({ name: "col" })` | Foreign key column name | FK column |
| `@Unique(["field1", "field2"])` | `UNIQUE(field1, field2)` | Composite unique |

### 5.2 Synchronization Behavior

**Development (`synchronize: true`):**

1. TypeORM analyzes entity decorators
2. Compares with existing database schema
3. Generates ALTER TABLE statements for differences
4. Executes DDL statements automatically
5. Creates missing tables, columns, indexes
6. **Does not drop columns** (requires manual migration)

**Production Workflow:**

1. Disable `synchronize: true`
2. Generate migration: `typeorm migration:generate -n MigrationName`
3. Review migration file in `src/migrations/`
4. Test in staging environment
5. Apply: `typeorm migration:run`
6. Rollback if needed: `typeorm migration:revert`

---

## 6. Data Integrity & Constraints


### 6.1 Constraint Types Implemented

**Primary Keys:**
- UUID-based for security and distributed system compatibility
- Auto-generated via `gen_random_uuid()`

**Unique Constraints:**
- Email fields (users, students)
- Course codes
- Composite: (student_id, course_id, academic_year)

**Check Constraints:**
- Score range validation (0-100)
- Can be extended for business rules

**NOT NULL Constraints:**
- Critical fields marked as required
- Enforced at database level

---


## 7. Security Considerations

### 7.1 Sensitive Data Handling

| Field | Storage Method | Access Control |
|-------|----------------|----------------|
| `users.password` | Bcrypt hash (12 rounds) | Write-only |
| `users.refresh_token` | Bcrypt hash (10 rounds) | Internal only |
| `students.email` | Plaintext (indexed) | Protected endpoints |

### 7.2 SQL Injection Prevention

**TypeORM**Protection:**
- Parameterized queries by default
- No string concatenation in queries
- Type-safe query builders

**Safe Pattern:**
```typescript
// ✅ Safe: Parameterized
repository.findOne({ where: { email } });

// ❌ Unsafe: Never do this
repository.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

## 8. References

- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)
- [Database Normalization Principles](https://en.wikipedia.org/wiki/Database_normalization)
- JWT Implementation: `docs/jwt_implementation.md`
- Entity Definitions: `src/modules/*/Entity.ts`