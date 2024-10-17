const axios = require('axios');
const config = require('../config/config');

let vectaToken = null;

// Authentication call

const authenticate = async () => {
    const response = await axios.post(`$config.vecta.apiUrl/auth`, {
        account: config.vecta.auth.company,
        username: config.vecta.auth.username,
        password: config.vecta.auth.password,
        restrictedAccess: true
    });
    vectaToken = response.data.token;
};

// API Interface

const vectaApi = axios.create({
    baseUrl: config.vecta.apiUrl,
    headers: {
        'x-api-key': config.vecta.apiKey
    }
});

// Request handler with authentication
// The request structure for Vecta calls is different to Winner's, owing to the bearer token requirement

const requestWithAuth = async (options) => {
    if (!vectaToken) await authenticate();
    const authHeaders = { 'Authorization':  `Bearer ${vectaToken}` };
    return vectaApi.request({ ...options, headers: { ...options.headers, ...authHeaders } });
};

// Requests - Companies

const getVectaCompanyById = async (accountNo) => {
    const response = await requestWithAuth({
        method: 'GET',
        url: `/companies/${accountNo}`
    });
    return response.data;
};

const getVectaCompanyByAccountNo = async (id) => {
    const response = await requestWithAuth({
        method: 'GET',
        url: `/companies/accountno/${id}`
    });
    return response.data;
};

// Requests - Projects

const getVectaProject = async (id) => {
    const response = await requestWithAuth({
        method: 'GET',
        url: `/projects/${id}`
    });
    return response.data;
};

const createVectaProject = async (projectData) => {
    const response = await requestWithAuth({
        method: 'POST',
        url: '/projects',
        data: projectData
    });
    return response.data;
};

const updateVectaProject = async (id, projectData) => {
    const response = await requestWithAuth({
        method: 'PUT',
        url: `/projects/${id}`,
        data: projectData
    });
    return response.data;
};

const searchVectaProject = async (id, projectData) => {
    const response = await requestWithAuth({
        method: 'POST',
        url: `/projects/search`,
        data: projectData
    });
    return response.data;
};

// Requests - Users

const getVectaUser = async (id) => {
    const response = await requestWithAuth({
        method: 'GET',
        url: `/users/${id}` 
    });
    return response.data;
};

const searchVectaUsers = async (userData) => {
    const response = await requestWithAuth({
        method: 'POST',
        url: `/users/search`
    });
    return response.data;
};

// Requests - Workflows

const getVectaWorkflowStage = async (id) => {
    const response = await requestWithAuth({
        method: `GET`,
        url: `/workflowstages/${id}`
    })
    return response.data;
};

module.exports = {
    getVectaCompanyById,
    getVectaCompanyByAccountNo,
    getVectaProject,
    createVectaProject,
    updateVectaProject,
    searchVectaProject,
    getVectaUser,
    searchVectaUsers,
    getVectaWorkflowStage
};
