INSERT INTO institutes (
    id,
    name,
    "establishedYear",
    city,
    country,
    status,
    "createdAt",
    "updatedAt"
)
SELECT
    gen_random_uuid(),
    'Institute ' || g,
    1980 + (random() * 40)::int,
    'City ' || (g % 50),
    'Country ' || (g % 20),
    true,
    NOW(),
    NOW()
FROM generate_series(1,100000) g;