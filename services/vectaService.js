const axios = require('axios');
const config = require('../config/config');

let vectaToken = null;

// Authentication call

const authenticate = async () => {
    const response = await axios.post(`${config.vecta.apiUrl}/auth`, {
        account: config.vecta.auth.company,
        username: config.vecta.auth.username,
        password: config.vecta.auth.password,
        restrictedAccess: true
    }, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.vecta.apiKey  // Add this header
        }
    });
    vectaToken = response.data.token;  // Store the token for later use
};

// API Interface

const vectaApi = axios.create({
    baseURL: config.vecta.apiUrl,
    headers: {
        'x-api-key': config.vecta.apiKey
    }
});

// Request handler with authentication
// The request structure for Vecta calls is different to Winner's, owing to the bearer token requirement

const requestWithAuth = async (options) => {
    if (!vectaToken) await authenticate();

    const headers = {
        'Authorization': `Bearer ${vectaToken}`,
        'Content-Type': 'application/json',
        'x-api-key': config.vecta.apiKey,
        'User-Agent': 'insomnia/9.3.2'
    };

    // Log the full URL for debugging
    const fullUrl = `${vectaApi.defaults.baseURL}${options.url}`;
    console.log('Making request with options:', {
        method: options.method,
        url: fullUrl,
        headers: { ...headers },
        params: options.params,
        data: options.data
    });

    try {
        const response = await vectaApi.request({
            ...options,
            headers: { ...headers }
        });
        return response.data;  // Return only the data from the response
    } catch (error) {
        // Log the error object to see what's available
        console.error('Error in requestWithAuth:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response'
        });
        throw error;  // Ensure the error is thrown to be caught upstream
    }
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

    try {
        const response = await requestWithAuth({
            method: 'GET',
            url: `/projects/${id}`,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Created Vecta project data:', response);
        return response;
    } catch (error) {
        console.error('Error in getVectaProject:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response'
        });

        throw error;
    }
};

const createVectaProject = async (projectData) => {
    console.log('Project Data being sent:', projectData);

    try {
        const responseData = await requestWithAuth({
            method: 'POST',
            url: '/projects',
            data: projectData,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract the project ID from the response data
        const projectId = responseData.id;
        console.log('Created Vecta project ID:', projectId);

        return projectId;  // Return the project ID
    } catch (error) {
        console.error('Error in createVectaProject:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response'
        });

        throw error;
    }
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

const searchVectaUserByName = async (userName) => {

    const formattedData = {
        searchField: "DisplayName",
        searchText: userName,
        pageSize: 50,
        pageNumber: 1
    };

    try {
        const response = await requestWithAuth({
            method: 'POST',
            url: `/users/search`,
            data: formattedData,
            headers: {
                'Content-Type': 'application/json'  // No need for x-api-key as it's already set
            }
        });

        let vectaUserId = null

        if (response.length === 1) {
            vectaUserId = response[0].id;
            // console.log(`Vecta user GUID is: ${vectaUserId}`);
        } else if (response.length > 1) {
            console.log("Warning: multiple matches for searchVectaUserByName() criteria. Defaulting to IT user.");
            vectaUserId = vecta.itUserId;
        } else if (response.length === 0) {
            console.log("No matches for searchVectaUserByName() criteria. Defaulting to IT user.")
            vectaUserId = config.vecta.itUserId;
        }

        return vectaUserId;  // Return the full response
    } catch (error) {
        // Handle the error appropriately
        console.error('Error in searchVectaUserByName:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                data: error.response.data
            } : 'No response'
        });

        // You can throw the error again if needed or return a default value
        throw error;  // Rethrow the error for upstream handling
    }
};

// Requests - Workflows

const getVectaWorkflowStage = async (id) => {
    const response = await requestWithAuth({
        method: `GET`,
        url: `/workflowstages/${id}`,

    })
    return response.data;
};

module.exports = {
    getVectaCompanyById,
    getVectaCompanyByAccountNo,
    getVectaProject, //
    createVectaProject, //
    updateVectaProject,
    searchVectaProject,
    getVectaUser,
    searchVectaUserByName,
    getVectaWorkflowStage
};
