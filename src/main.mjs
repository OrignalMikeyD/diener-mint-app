import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendMessage } from './utils/mailer.mjs';
import { getAllProjects, getProjectById } from './utils/database.mjs';
// Load the variables from .env into process.env
dotenv.config();
// ES modules do not provide __dirname, so derive it from this file's URL
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Use the port DigitalOcean assigns at runtime, or fall back to 3000 locally
const port = process.env.PORT || 3000;
// Use EJS as the view engine and point it at src/views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Parse incoming JSON request bodies, so we can read the form data the client sends
app.use(express.json());
// HOME: load every project, then pick ONE at random to feature.
// Math.random() returns 0 up to (but not including) 1. Multiply by the number of
// projects and floor it, and you get a valid array index: 0, 1, or 2 for three projects.
// We pass the whole project object to the template as "featured".
app.get('/', async (req, res) => {
    try {
        const projects = await getAllProjects();
        const randomIndex = Math.floor(Math.random() * projects.length);
        const featured = projects[randomIndex];
        res.render('index', { title: 'Diener Mint | Michael Diener', featured });
    } catch (error) {
        console.error('Failed to load home page:', error);
        res.status(500).send('Something went wrong loading the page.');
    }
});
// PROJECTS LIST: load the whole array and hand it to the projects template.
app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        res.render('projects', { title: 'Projects | Diener Mint', projects });
    } catch (error) {
        console.error('Failed to load projects:', error);
        res.status(500).send('Something went wrong loading the projects.');
    }
});
// SINGLE PROJECT: load all data for one project by the id in the URL (e.g. /projects/2).
// If no project has that id, send a clean 404 instead of crashing.
app.get('/projects/:id', async (req, res) => {
    try {
        const project = await getProjectById(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found.');
        }
        res.render('project', { title: `${project.title} | Diener Mint`, project });
    } catch (error) {
        console.error('Failed to load project:', error);
        res.status(500).send('Something went wrong loading the project.');
    }
});
// Serve static files (contact.html, css, etc.) from public.
// This comes AFTER the routes above so the dynamic routes win.
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