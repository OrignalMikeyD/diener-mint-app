import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { readFile } from 'node:fs/promises';

// Run this ONCE from your project root: node db-setup.mjs

dotenv.config();

const sql = await readFile('./schema.sql', 'utf8');

const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
});

console.log('Connected to the database. Running schema...');
await conn.query(sql);

const [rows] = await conn.query('SELECT * FROM projects ORDER BY id');
console.log(`Done. ${rows.length} projects now in the table:`);
console.table(rows);

await conn.end();
