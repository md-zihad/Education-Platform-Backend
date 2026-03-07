INSERT INTO courses (
    id,
    name,
    code,
    credits,
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    'Course ' || g,
    'COURSE_' || g,
    (1 + floor(random()*4))::int,
    NOW(),
    NOW()
FROM generate_series(1,1000) g;