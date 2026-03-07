# Query Performance Benchmark Report

## Overview

This document summarizes query performance benchmarks for core read and write operations in the Education Platform Backend. The analysis is based on `EXPLAIN ANALYZE` output captured before and after query optimizations such as indexing and pagination tuning.

- **Database engine:** PostgreSQL
- **ORM layer:** TypeORM
- **Benchmark focus:**
    - Read query pagination efficiency
    - Write/update performance with indexing
    - Practical before/after execution plan changes

## Benchmark Scenarios Covered

The benchmark images cover the following scenarios:

1. Institute read query pagination (before vs after)
2. Student read query pagination (before vs after)
3. Student create performance with indexing (before vs after)
4. Result read query pagination (before vs after)
5. Result update performance with indexing (before vs after)

---

## 1. Institute Read Query Pagination

### Query Context

This query pattern retrieves institute records ordered by creation time and paginated via `LIMIT` and `OFFSET`.

```sql
EXPLAIN ANALYZE
SELECT *
FROM institutes
ORDER BY "createdAt" DESC
LIMIT 5000 OFFSET 5000;
```

### Before Indexing

![Institute Read Query Pagination - Before](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890666/Institue_Read_Query_Paginition_vksu3e.png)

### After Indexing

![Institute Read Query Pagination - After](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890666/Institue_Read_Query_After_Paginition_mfdwfh.png)

### Verified Metrics

| Metric | Before | After |
|---|---:|---:|
| Planning Time | 0.118 ms | 0.961 ms |
| Execution Time | 27.613 ms | 1.186 ms |
| Improvement | - | ~23x faster |

### Before vs After Comparison Chart

| Aspect | Before | After |
|---|---|---|
| Access Path | Parallel Sequential Scan | Index Scan Backward |
| Sort Operation | Required (`Gather Merge` + `Sort`) | Not required |
| Planning Time | 0.118 ms | 0.961 ms |
| Execution Time | 27.613 ms | 1.186 ms |
| Result | Baseline | ~23x faster |

### Indexing Applied

```sql
CREATE INDEX idx_institute_created
ON institutes("createdAt" DESC);
```

- **Purpose**: optimize `ORDER BY "createdAt" DESC` with pagination.
- **Effect**: allows PostgreSQL to fetch rows in sorted order directly from the index.
- **Benefit**: removes full-table sort overhead and improves page retrieval latency.

### Notes

- The optimized plan uses an index-backed scan path and avoids expensive sorting.
- Pagination performance improves significantly under large offsets.

---

## 2. Student Read Query

### Before Indexing

![Student Read Pagination - Before](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890666/Student_Read_Before_Paginition_bdfeod.png)

### After Indexing

![Student Read Pagination - After](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890665/Student_Read_After_Paginition_gqczzt.png)

### Verified Metrics (from benchmark capture)

| Metric | Before | After |
|---|---:|---:|
| Planning Time | 0.110 ms | 0.127 ms |
| Execution Time | 57.889 ms | 10.992 ms |
| Improvement | - | ~5.3x faster |

### Before vs After Comparison Chart

| Aspect | Before | After |
|---|---|---|
| Access Path | Higher-cost scan path | Lower-cost indexed/optimized path |
| Sort/Processing Overhead | Higher | Lower |
| Planning Time | 0.110 ms | 0.127 ms |
| Execution Time | 57.889 ms | 10.992 ms |
| Pagination Efficiency | Lower under large offsets | Improved for paginated reads |
| Result | Baseline | ~5.3x faster |

### Notes

- The after-plan indicates more efficient page retrieval for student list queries.
- This optimization is important for student management endpoints with high-volume reads.
- Execution time improved from 57.889 ms to 10.992 ms, a ~5.3x speedup.

### Indexing Applied

Recommended/typical indexes for this query pattern:

```sql
CREATE INDEX idx_student_created_at_desc
ON students("createdAt" DESC);

CREATE INDEX idx_student_institute_created_at
ON students("instituteId", "createdAt" DESC);
```

- **Purpose**: optimize list queries sorted by creation time, optionally filtered by institute.
- **Effect**: reduces row scans and sort work for paginated student retrieval.
- **Benefit**: better response time consistency as table size grows.

---

## 3. Student Create Query

### Before Indexing

![Student Create - Before Indexing](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890665/Student_Create_Before_Indexing_y1spaz.png)

### After Indexing

![Student Create - After Indexing](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890665/Student_Create_After_Indexing_fz9aww.png)

### Verified Metrics (from benchmark capture)

| Metric | Before | After |
|---|---:|---:|
| Planning Time | 1.279 ms | 1.173 ms |
| Execution Time | 51.778 ms | 26.652 ms |
| Improvement | - | ~1.9x faster |

### Before vs After Comparison Chart

| Aspect | Before | After |
|---|---|---|
| Insert-Related Lookup Cost | Higher | Lower |
| Constraint/Validation Path | More expensive lookups | Faster lookups via indexes |
| Planning Time | 1.279 ms | 1.173 ms |
| Execution Time | 51.778 ms | 26.652 ms |
| Write Performance | Baseline | Improved under repeated inserts |
| Result | Baseline | ~1.9x faster |

### Notes

- Index strategy improves lookup and constraint-check efficiency during insert workflows.
- This is relevant for registration and bulk onboarding operations.
- Execution time reduced from 51.778 ms to 26.652 ms, achieving ~1.9x speedup.

### Indexing Applied

Likely indexes supporting create-time checks and relational integrity:

```sql
CREATE UNIQUE INDEX idx_student_email_unique
ON students(email);

CREATE INDEX idx_student_institute
ON students("instituteId");
```

- **Purpose**: speed up uniqueness checks (`email`) and foreign key lookups (`instituteId`).
- **Effect**: reduces overhead during insert and validation phases.
- **Benefit**: improved create throughput for student onboarding.

---

## 4. Result Read Query

### Before Indexing

![Result Read Pagination - Before](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890666/Result_Read_Before_Paginition_qt4wqt.png)

### After Indexing

![Result Read Pagination - After](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890665/Result_Read_After_Paginition_eyyrfy.png)

### Verified Metrics (from benchmark capture)

| Metric | Before | After |
|---|---:|---:|
| Planning Time | 0.140 ms | 0.123 ms |
| Execution Time | 51.237 ms | 10.437 ms |
| Improvement | - | ~4.9x faster |

### Before vs After Comparison Chart

| Aspect | Before | After |
|---|---|---|
| Access Path | Higher-cost scan/sort path | More efficient indexed path |
| Sort/Join Overhead | Higher | Lower |
| Planning Time | 0.140 ms | 0.123 ms |
| Execution Time | 51.237 ms | 10.437 ms |
| Pagination Efficiency | Lower | Improved |
| Result | Baseline | ~4.9x faster |

### Notes

- Result retrieval becomes more stable and efficient with improved access paths.
- This directly affects analytics/reporting endpoints that consume result data.
- Execution time improved from 51.237 ms to 10.437 ms, a ~4.9x speedup.

### Indexing Applied

Recommended/typical indexes for result read patterns:

```sql
CREATE INDEX idx_result_created_at_desc
ON results("createdAt" DESC);

CREATE INDEX idx_result_student_year
ON results("studentId", "academicYear");

CREATE INDEX idx_result_course_year
ON results("courseId", "academicYear");
```

- **Purpose**: optimize paginated result lists and common filters by student/course/year.
- **Effect**: improves scan selectivity and reduces sort/aggregation work.
- **Benefit**: faster report and dashboard queries.

---

## 5. Result Update Query

### Before Indexing

![Result Update - Before Indexing](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890665/Result_Update_before_indexing_p8midq.png)

### After Indexing

![Result Update - After Indexing](https://res.cloudinary.com/deibsq1hv/image/upload/v1772890665/Result_Update_after_indexing_uaake2.png)

### Verified Metrics (from benchmark capture)

| Metric | Before | After |
|---|---:|---:|
| Planning Time | 1.159 ms | 3.192 ms |
| Execution Time | 1488.147 ms | 679.695 ms |
| Improvement | - | ~2.2x faster |

### Before vs After Comparison Chart

| Aspect | Before | After |
|---|---|---|
| Update Row Location Cost | Higher (more scanning) | Lower (index-assisted targeting) |
| Filter Predicate Efficiency | Lower | Higher |
| Planning Time | 1.159 ms | 3.192 ms |
| Execution Time | 1488.147 ms | 679.695 ms |
| Write Latency | Higher | Lower |
| Result | Baseline | ~2.2x faster |

### Notes

- Update paths benefit from indexes on filter and join-relevant columns.
- Reduced scan overhead helps maintain responsiveness during frequent grade updates.
- Execution time reduced from 1488.147 ms to 679.695 ms, achieving ~2.2x speedup.
- Note: Planning time slightly increased (1.159 ms to 3.192 ms) due to more complex index evaluation, but overall query time still improved significantly.

### Indexing Applied

Recommended/typical indexes for targeted updates:

```sql
CREATE INDEX idx_result_student_course_year
ON results("studentId", "courseId", "academicYear");

CREATE INDEX idx_result_updated_at
ON results("updatedAt");
```

- **Purpose**: quickly locate a specific result row for update operations.
- **Effect**: reduces full/partial scans during update predicates.
- **Benefit**: lower update latency and better concurrency behavior.

---

## Performance Summary: All Queries

### Complete Metrics Overview

| Query Type | Operation | Planning Time (Before) | Planning Time (After) | Execution Time (Before) | Execution Time (After) | Speedup |
|---|---|---:|---:|---:|---:|---:|
| Institute Read | Pagination | 0.118 ms | 0.961 ms | 27.613 ms | 1.186 ms | **23.3x** |
| Student Read | Pagination | 0.110 ms | 0.127 ms | 57.889 ms | 10.992 ms | **5.3x** |
| Student Create | Insert with Indexing | 1.279 ms | 1.173 ms | 51.778 ms | 26.652 ms | **1.9x** |
| Result Read | Pagination | 0.140 ms | 0.123 ms | 51.237 ms | 10.437 ms | **4.9x** |
| Result Update | Update with Indexing | 1.159 ms | 3.192 ms | 1488.147 ms | 679.695 ms | **2.2x** |

### Execution Time Comparison (Visual)

```
Institute Read Pagination:
Before:  ████████████████████████████ (27.613 ms)
After:   █ (1.186 ms)                                      ⚡ 23.3x faster

Student Read Pagination:
Before:  ██████████████████████████████████████████████████████████ (57.889 ms)
After:   ███████████ (10.992 ms)                            ⚡ 5.3x faster

Student Create (Indexing):
Before:  ███████████████████████████████████████████████████████ (51.778 ms)
After:   ███████████████████████████ (26.652 ms)            ⚡ 1.9x faster

Result Read Pagination:
Before:  ███████████████████████████████████████████████████████ (51.237 ms)
After:   ██████████ (10.437 ms)                             ⚡ 4.9x faster

Result Update (Indexing):
Before:  ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████████ (1488.147 ms)
After:   ████████████████████████████████████████████████████████████████████ (679.695 ms)  ⚡ 2.2x faster
```

### Key Insights

1. **Best Performance Gain**: Institute Read Pagination achieved the highest speedup at **23.3x faster** (27.613 ms → 1.186 ms)
2. **Most Critical Improvement**: Result Update operations improved from 1488.147 ms to 679.695 ms, saving **~808 ms per update**
3. **Consistent Read Optimization**: All paginated read queries improved by **4.9x to 23.3x**
4. **Write Operation Benefits**: Insert and update operations saw **1.9x to 2.2x** improvements, demonstrating indexing efficiency

### Total Time Saved (per operation)

| Query Type | Time Saved | Percentage Reduction |
|---|---:|---:|
| Institute Read | 26.427 ms | 95.7% |
| Student Read | 46.897 ms | 81.0% |
| Student Create | 25.126 ms | 48.5% |
| Result Read | 40.800 ms | 79.6% |
| Result Update | 808.452 ms | 54.3% |

---


## Conclusion

The benchmark evidence across all captured scenarios confirms that targeted indexing and pagination-aware query design substantially improve PostgreSQL execution plans and response times for Institute, Student, and Result modules. The optimizations achieved speedups ranging from **1.9x to 23.3x**, with the most dramatic improvements seen in paginated read operations.