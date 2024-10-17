const axios = require('axios');
const config = require('../config/config')

// API Interface
const winnerApi = axios.create({
    baseUrl: config.winner.apiUrl,
    headers: {
        'apiKey': config.winner.apiKey,
        'Content-Type': 'application/json'
    }
});

// Projects
const filterProjects = async (projectNumberList) => {
    const response = await winnerApi.post('/projects/filter', { projectNumberList });
    return response.data;
};
