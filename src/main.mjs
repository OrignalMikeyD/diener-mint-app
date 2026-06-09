import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendMessage } from './utils/mailer.mjs';

// Load the variables from .env into process.env
dotenv.config();

// ES modules do not provide __dirname, so derive it from this file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Use EJS as the view engine and point it at src/views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse incoming JSON request bodies, so we can read the form data the client sends
app.use(express.json());

// Render the home page through the EJS template (must come before static so the route wins)
app.get('/', (req, res) => {
    res.render('index', { title: 'Diener Mint | Michael Diener' });
});

// Serve static files (contact.html, projects.html, css, etc.) from the public folder
app.use(express.static('public'));

// Receive the contact form submission and send the email
app.post('/send', async (req, res) => {
    const { subject, text } = req.body;

    try {
        await sendMessage(subject, text);
        res.json({ success: true });
    } catch (error) {
        console.error('Email send failed:', error);
        res.status(500).json({ success: false });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});