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
    const response = await winnerApi.post(`/projects/filter`, { projectNumberList });
    return response.data;
};

const getProject = async (projectGuid, shopGuid) => {
    const response = await winnerApi.get(`/projects/${projectGuid}`, {
        params: { shopGuid }
    });
    return response.data;
}

const updateProject = async (projectGuid, shopGuid, projectData) => {
    const response = await winnerApi.put(`/projects/${projectGuid}`, projectData, {
        params: { shopGuid }
    });
    return response.data;
};

const createProject = async (projectGuid, shopGuid, projectData) => {
    const response = await winnerApi.post(`/projects`, projectData, {
        params: { shopGuid }
    });
    return response.data;
};

// Project GUIDs

const getProjectTypeGuids = async () => {
    const response = await winnerApi.get(`/projects/types`);
    return response.data;
};

const getProjectStatusGuids = async () => {
    const response = await winnerApi.get(`/projects/statuses`);
    return response.data;
};
