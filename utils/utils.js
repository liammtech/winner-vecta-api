const path = require('path');
const fs = require('fs').promises;

const logError = (error) => {
    console.error('Error: ', error.message);
};

const validateWebhookData = (webhookData) => {
    if (webhookData.source != 'https://flex.cyncly.com/eapi/pubsub') {
        console.log("Warning: request not from Cyncly");
    } else {
        console.log("Data from Cyncly received");
        return true;
    }
};

const parseWebhookData = (webhookData) => {
    const subjectParts = webhookData.subject.split('/');
    const winnerProjectGuid = subjectParts[2];
    const winnerShopGuid = subjectParts[1];
    
    return {
        winnerProjectGuid,
        winnerShopGuid
    }
};

const readWorkflowStatuses = async () => {
    const jsonPath = path.resolve(__dirname, '../json/workflow-statuses.json');
    console.log(`Attempting to read workflow statuses from: ${jsonPath}`);
    
    try {
        const data = await fs.readFile(jsonPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading workflow statuses:', error.message);
        throw error;
    }
};

module.exports = {
    logError,
    validateWebhookData,
    parseWebhookData,
    readWorkflowStatuses
};
