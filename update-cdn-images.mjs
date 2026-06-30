import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Run ONCE after you upload your three images to DigitalOcean Spaces:
//   node update-cdn-images.mjs
// Paste each Space CDN URL below, matched to its project title. This updates the
// existing rows in place, so it will NOT wipe any projects you added through the form.

dotenv.config();

const CDN = {
    'Untitled (First Mint)': 'PASTE_SPACES_CDN_URL_1',
    'Static Bloom':          'PASTE_SPACES_CDN_URL_2',
    'Curtain Call':          'PASTE_SPACES_CDN_URL_3'
};

const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

for (const [title, url] of Object.entries(CDN)) {
    const [result] = await conn.execute(
        'UPDATE projects SET image_url = ? WHERE title = ?',
        [url, title]
    );
    console.log(`${title}: ${result.affectedRows} row updated`);
}

const [rows] = await conn.query('SELECT id, title, image_url FROM projects ORDER BY id');
console.table(rows);

await conn.end();
