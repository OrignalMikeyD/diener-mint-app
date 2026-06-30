import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sendMessage } from './utils/mailer.mjs';
import { getAllProjects, getProjectById, createProject } from './utils/database.mjs';
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
// Parse incoming request bodies.
// json() handles the contact form's fetch() call.
// urlencoded() handles the standard HTML <form> POST from the Add Project page.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HOME: load every project, then pick ONE at random to feature.
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
        res.render('projects', { title: 'Projects | Diener Mint', projects, active: 'projects' });
    } catch (error) {
        console.error('Failed to load projects:', error);
        res.status(500).send('Something went wrong loading the projects.');
    }
});

// NEW PROJECT FORM: show the page for adding a project.
// IMPORTANT: this route MUST come before '/projects/:id'. Express matches routes
// top to bottom, and ':id' would otherwise capture the word "new" as an id and
// run the detail route by mistake.
app.get('/projects/new', (req, res) => {
    res.render('new', { title: 'Add Project | Diener Mint', active: 'new' });
});

// CREATE PROJECT: receive the form POST, insert the row, then show the new project.
app.post('/projects', async (req, res) => {
    try {
        const newId = await createProject({
            title: req.body.title,
            image_url: req.body.image_url,
            description: req.body.description,
            medium: req.body.medium,
            // Empty form fields arrive as "". Convert those to null so the numeric
            // and date columns accept them instead of throwing an error.
            price_eth: req.body.price_eth || null,
            minted_date: req.body.minted_date || null
        });
        res.redirect(`/projects/${newId}`);
    } catch (error) {
        console.error('Failed to create project:', error);
        res.status(500).send('Something went wrong saving the project.');
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
