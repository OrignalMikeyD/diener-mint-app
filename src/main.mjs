import express from 'express';
import dotenv from 'dotenv';
import { sendMessage } from './utils/mailer.mjs';

// Load the variables from .env into process.env
dotenv.config();

const app = express();
const port = 3000;

// Parse incoming JSON request bodies, so we can read the form data the client sends
app.use(express.json());

// Serve static files (index.html, contact.html, etc.) from the public folder
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
