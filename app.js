const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const projectRoutes = require('./routes/projectRoutes');

app.use(bodyParser.json()); // Ensure this line is included
app.use('/webhook', projectRoutes); // This sets up the route for webhooks

const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    next();
});

axios.interceptors.request.use(request => {
    console.log('Starting Request', request);
    return request;
}, error => {
    console.error('Error in request:', error);
    return Promise.reject(error);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
