INSERT INTO results (
    id,
    "studentId",
    "courseId",
    score,
    grade,
    "academicYear",
    "createdAt"
)
SELECT
    gen_random_uuid(),
    s.id,
    c.id,
    round((random()*40 + 60)::numeric,2),
    CASE
        WHEN random() > 0.9 THEN 'A'
        WHEN random() > 0.75 THEN 'B'
        WHEN random() > 0.5 THEN 'C'
        WHEN random() > 0.3 THEN 'D'
        ELSE 'F'
    END,
    (2020 + floor(random()*4))::int,
    NOW()
FROM
    (SELECT id FROM students ORDER BY random() LIMIT 500000) s
CROSS JOIN LATERAL
    (SELECT id FROM courses ORDER BY random() LIMIT 1) c
ON CONFLICT DO NOTHING;