const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json()); // This will handle JSON payloads from webhooks

const webhookRoutes = require('./routes/projectRoutes'); // Assuming this is your routes file

app.use('/webhook', webhookRoutes); // Route for handling webhooks

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
