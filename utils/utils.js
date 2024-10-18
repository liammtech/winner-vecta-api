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

module.exports = {
    logError,
    validateWebhookData,
    parseWebhookData
};
