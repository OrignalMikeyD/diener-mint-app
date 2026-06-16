-- Run this ONCE via db-setup.mjs to create the projects table and seed three rows.

DROP TABLE IF EXISTS projects;

CREATE TABLE projects (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(255) NOT NULL,
    image_url    VARCHAR(500) NOT NULL,
    description  TEXT,
    medium       VARCHAR(255),
    price_eth    DECIMAL(10, 4),
    minted_date  DATE
);

INSERT INTO projects (title, image_url, description, medium, price_eth, minted_date) VALUES
(
    'Untitled (First Mint)',
    'https://picsum.photos/seed/diener1/800/600',
    'The opening piece. A study in what it means to put the first mark on an empty chain, made the night the contract finally deployed.',
    'Generative p5.js sketch, 1 of 1',
    0.0800,
    '2026-05-18'
),
(
    'Static Bloom',
    'https://picsum.photos/seed/diener2/800/600',
    'Noise fields forced into the shape of a flower, then left to decay. Each frame is the same algorithm fed a different seed.',
    'Generative sketch, edition of 10',
    0.0400,
    '2026-05-29'
),
(
    'Curtain Call',
    'https://picsum.photos/seed/diener3/800/600',
    'Twelve years of stage exits compressed into one looping gesture. The performer leaves; the code keeps bowing.',
    'Animated sketch, 1 of 1',
    0.1200,
    '2026-06-10'
);
