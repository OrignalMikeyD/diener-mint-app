// ============================================================
// contact.js  —  client-side form handling
// Lives in public/, so it is served to the browser.
// Never put secrets in here. Anyone can read it via View Source.
// ============================================================

// Grab the form and the status message element
const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

// Listen for the form submit
form.addEventListener('submit', (event) => {
    // Stop the browser's default submit behavior, which reloads the page
    event.preventDefault();
    event.stopPropagation();

    // Bootstrap validity check: returns true only if every required field is valid
    if (form.checkValidity()) {
        sendEmail();
    }

    // Adding this class tells Bootstrap to show the green/red field styling
    form.classList.add('was-validated');
});

// Build the data from the form and POST it to the server
async function sendEmail() {
    // Pull the values out of the form fields
    const firstName = document.querySelector('#first-name').value;
    const lastName = document.querySelector('#last-name').value;
    const email = document.querySelector('#mail').value;
    const message = document.querySelector('#msg').value;

    // Assemble the email subject and body using template literals
    const subject = `New message from ${firstName} ${lastName}`;
    const text = `Name: ${firstName} ${lastName}\nEmail: ${email}\n\nMessage:\n${message}`;

    // Give the user feedback while the request is in flight
    status.textContent = 'Sending...';
    status.className = 'mt-3 text-muted';

    try {
        // POST the data to the /send endpoint (built on the server in the next step)
        const response = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subject, text })
        });

        if (response.ok) {
            status.textContent = 'Message sent. Thank you for reaching out.';
            status.className = 'mt-3 text-success';
            form.reset();
            form.classList.remove('was-validated');
        } else {
            status.textContent = 'Something went wrong on the server. Please try again.';
            status.className = 'mt-3 text-danger';
        }
    } catch (error) {
        // This fires if the server is unreachable or the endpoint does not exist yet
        status.textContent = 'Could not reach the server. Please try again later.';
        status.className = 'mt-3 text-danger';
    }
}
