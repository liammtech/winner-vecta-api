const { filterWinnerProjects, getWinnerProject, updateWinnerProject, createWinnerProject, getWinnerProjectTypeGuids, getWinnerProjectStatusGuids, getWinnerShops, getWinnerCompanyUsers, getWinnerUserById } = require('../services/winnerService');
const { getVectaCompanyById, getVectaCompanyByAccountNo, getVectaProject, createVectaProject, updateVectaProject, searchVectaProject, getVectaUser, searchVectaUsers, getVectaWorkflowStage } = require('../services/vectaService');
const { logError, validateWebhookData, parseWebhookData } = require('../utils/utils');

const handleProjectCreated = async (req, res) => {

    // Wrap all logic in try/catch block
    try {

        // See data from webhook request
        console.log(req.body);

        // Validate the data receive from the webhook
        const webhookValidation = await validateWebhookData(req.body);
        if (!webhookValidation) {
            res.status(400).json({ message: 'Invalid webhook data' });
            console.log("Invalid webhook data")
            return;
        } else {
            console.log("Webhook data is valid")
        }

        // Get new Winner project's projectGuid and shopGuid from webhook subject
        const { winnerProjectGuid, winnerShopGuid } = await parseWebhookData(req.body);

        console.log(`Winner project id is: ${winnerProjectGuid}`);
        console.log(`Winner project id is: ${winnerShopGuid}`);

        // Get Winner Project data
        const winnerProjectData = await getWinnerProject(winnerProjectGuid, winnerShopGuid);

        // Get Winner users
        const winnerUsers = await getWinnerCompanyUsers();

        // Get name of Winner project creator
        const winnerProjectUser = winnerUsers[winnerProjectData.ourRefGuid];

        // Get Vecta GUID of Winner Project creator
        // If there is no match, default to "IT"
        const vectaUserGuid = await searchVectaUsers(winnerProjectUser);
        console.log(`Vecta user GUID is: ${vectaUserGuid}`)

        // Confirm project creation success to Winner
        res.status(200).json({ message: 'Project created successfully!' });

    } catch (error) {

        logError(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};

module.exports = handleProjectCreated;
