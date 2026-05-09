import express from 'express';

const app = express();
const port = 3000;

// Serve static files from the public folder
app.use(express.static('public'));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello World! Express is running.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});