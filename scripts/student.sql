INSERT INTO students (
    id,
    name,
    email,
    age,
    gender,
    institute_id,
    "enrollmentYear",
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    'Student ' || g,
    'student' || g || '@example.com',
    (18 + floor(random()*10))::int,
    (ARRAY['Male','Female','Other'])[floor(random()*3)+1],
    (SELECT id FROM institutes ORDER BY random() LIMIT 1),
    (2018 + floor(random()*6))::int,
    NOW(),
    NOW()
FROM generate_series(1,100000) g;