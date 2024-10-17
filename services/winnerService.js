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

// Requests - Projects

const filterWinnerProjects = async (projectNumberList) => {
    const response = await winnerApi.post(`/projects/filter`, { projectNumberList });
    return response.data;
};

const getWinnerProject = async (projectGuid, shopGuid) => {
    const response = await winnerApi.get(`/projects/${projectGuid}`, {
        params: { shopGuid }
    });
    return response.data;
}

const updateWinnerProject = async (projectGuid, shopGuid, projectData) => {
    const response = await winnerApi.put(`/projects/${projectGuid}`, projectData, {
        params: { shopGuid }
    });
    return response.data;
};

const createWinnerProject = async (projectGuid, shopGuid, projectData) => {
    const response = await winnerApi.post(`/projects`, projectData, {
        params: { shopGuid }
    });
    return response.data;
};

// Requests - Project GUIDs

const getWinnerProjectTypeGuids = async () => {
    const response = await winnerApi.get(`/projects/types`);
    return response.data;
};

const getWinnerProjectStatusGuids = async () => {
    const response = await winnerApi.get(`/projects/statuses`);
    return response.data;
};

// Requests - Shops

const getWinnerShops = async () => {
    const response = await winnerApi.get(`/shops`);
    return response.data;
};

// Requests - Users

const getWinnerCompanyUsers = async () => {
    const response = await winnerApi.get(`/users`);
    return response.data;
};

const getWinnerUserById = async (id) => {
    const response = await winnerApi.get(`/users/${id}`);
    return response.data;
};

// Export endpoint calls

module.exports = {
    filterWinnerProjects, 
    getWinnerProject, //
    updateWinnerProject, //
    createWinnerProject,
    getWinnerProjectTypeGuids,
    getWinnerProjectStatusGuids, //
    getWinnerShops, //
    getWinnerCompanyUsers,
    getWinnerUserById //
};
