const { filterWinnerProjects, getWinnerProject, updateWinnerProject, createWinnerProject, getWinnerProjectTypeGuids, getWinnerProjectStatusGuids, getWinnerShops, getWinnerCompanyUsers, getWinnerUserById } = require('../services/winnerService');
const { getVectaCompanyById, getVectaCompanyByAccountNo, getVectaProject, createVectaProject, updateVectaProject, searchVectaProject, getVectaUser, searchVectaUserByName, getVectaWorkflowStage } = require('../services/vectaService');
const { logError, validateWebhookData, parseWebhookData } = require('../utils/utils');
const { vecta } = require('../config/config');

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
        const vectaUserId = await searchVectaUserByName(winnerProjectUser);
        console.log(`Vecta user GUID is: ${vectaUserId}`);
        
        // Confirm project creation success to Winner
        res.status(200).json({ message: 'Project created successfully!' });

        // Create Project in Vecta
        const vectaProjectId = await createVectaProject({
            "name": winnerProjectData.projectName,
            "description": winnerProjectData.projectId.toString(),
            "workflowId": "ad14bd95-96ea-4972-8081-83b8790b36d6",
            "ownerId": vectaUserId,
            "assignedToId": vectaUserId
        });

        console.log(`Vecta project data: ${vectaProjectId}`);

        // Get new Vecta Project number
        const vectaProjectData = await getVectaProject(vectaProjectId);
        const vectaProjectNo = vectaProjectData.projectNo;
        
        console.log(vectaProjectNo);

        // Add Vecta Project number to Winner Project's External Unique ID field - this then links the two projects

        winnerProjectData.externalUniqueID = vectaProjectNo
        // console.log(winnerProjectData.projedtGuid, winnerProjectData.shopGuid, winnerProjectData)
        const winnerProjectLinked = await updateWinnerProject(winnerProjectData.projectGuid, winnerProjectData.shopGuid, winnerProjectData);
        console.log(winnerProjectLinked);

    } catch (error) {

        logError(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};

module.exports = handleProjectCreated;
