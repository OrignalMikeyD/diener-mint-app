import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD from .env into process.env
dotenv.config();

// We keep a single connection alive and reuse it instead of opening a new one per request
let connection;

// Open the connection the first time we need it, then hand back the same one after that
export async function connect() {
    if (connection) return connection;

    connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        // DigitalOcean's managed MySQL refuses plain connections and requires TLS.
        // rejectUnauthorized: false accepts DO's certificate without downloading their CA file.
        // Fine for this course project; in production you would supply the CA cert instead.
        ssl: { rejectUnauthorized: false }
    });

    return connection;
}

// Return every project, ordered by id, for the projects listing page
export async function getAllProjects() {
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM projects ORDER BY id');
    return rows;
}

// Return one project by its id for the detail page.
// We use execute() with a ? placeholder, which is a prepared statement: MySQL treats
// the id as data, never as SQL, so a malicious id cannot rewrite our query (SQL injection).
export async function getProjectById(id) {
    const conn = await connect();
    const [rows] = await conn.execute('SELECT * FROM projects WHERE id = ?', [id]);
    return rows[0]; // undefined if no project matches that id
}
