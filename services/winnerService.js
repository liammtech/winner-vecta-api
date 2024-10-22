const axios = require('axios');
const config = require('../config/config')

// API Interface

const winnerApi = axios.create({
    baseURL: config.winner.apiUrl,
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
    console.log(`Updating Winner project with data: ${projectData}`)
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

// Requests - Projects - Competitors

const getWinnerCompetitorName = async (competitorId) => {
    const response = await winnerApi.get(`/projects/competitors`);
    console.log(`COMPETITOR NAME IS: ${response.competitorId}`)
    competitorName = response.data[competitorId];

    return competitorName;
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

// References - Shops

const referToWinnerShopById = async (id) => {
    switch(id) {
        case config.winnerShops.kitchenKitId:
            return "Kitchen Kit";
        case config.winnerShops.blossomAvenueId:
            return "Blossom Avenue";
        case config.winnerShops.pimlicoId:
            return "Pimlico";
        case config.winnerShops.testShopId:
            return "Test Shop"
        default:
            return "Shop TBC";
    }
};

/*
        kitchenKitId: process.env.WINNER_SHOP_KITCHEN_KIT_ID,
        blossomAvenueId: process.env.WINNER_SHOP_BLOSSOM_AVENUE_ID,
        pimlicoId: process.env.WINNER_SHOP_PIMLICO_ID,
        testShopId: process.env.WINNER_SHOP_TEST_SHOP_ID
*/

// Export endpoint calls

module.exports = {
    filterWinnerProjects, 
    getWinnerProject,
    updateWinnerProject,
    createWinnerProject,
    getWinnerProjectTypeGuids,
    getWinnerProjectStatusGuids,
    getWinnerCompetitorName,
    getWinnerShops,
    getWinnerCompanyUsers,
    getWinnerUserById,
    referToWinnerShopById
};
