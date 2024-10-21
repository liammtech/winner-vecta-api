const { filterWinnerProjects, getWinnerProject, updateWinnerProject, createWinnerProject, getWinnerProjectTypeGuids, getWinnerProjectStatusGuids, getWinnerShops, getWinnerCompanyUsers, getWinnerUserById, referToWinnerShopById } = require('../services/winnerService');
const { getVectaCompanyById, getVectaCompanyByAccountNo, getVectaProject, createVectaProject, updateVectaProject, searchVectaProject, updateVectaUdValues, getVectaUser, searchVectaUserByName, getVectaWorkflowStage } = require('../services/vectaService');
const { logError, validateWebhookData, parseWebhookData } = require('../utils/utils');
const config = require('../config/config');

const handleProjectCreated = async (req, res) => {

    // Wrap all logic in try/catch block
    try {


        console.log(JSON.stringify(config))
        // See data from webhook request
        console.log(req.body);

        // Validate the data received from the webhook
        const webhookValidation = await validateWebhookData(req.body);
        if (!webhookValidation) {
            res.status(400).json({ message: 'Invalid webhook data' });
            console.log("Invalid webhook data");
            return;
        } else {
            console.log("Webhook data is valid - Project-create route");
        }

        // Get new Winner project's projectGuid and shopGuid from webhook subject
        const { winnerProjectGuid, winnerShopGuid } = await parseWebhookData(req.body);
        console.log(`Winner project id is: ${winnerProjectGuid}`);
        console.log(`Winner shop id is: ${winnerShopGuid}`);

        // Get Winner Project data
        const winnerProjectData = await getWinnerProject(winnerProjectGuid, winnerShopGuid);
        console.log(`Winner project data is most certainly: ${JSON.stringify(winnerProjectData)}`)

        // Get Winner users
        const winnerUsers = await getWinnerCompanyUsers();

        // Get name of Winner project creator
        const winnerProjectUser = winnerUsers[winnerProjectData.ourRefGuid];

        // Get Vecta GUID of Winner Project creator
        // If there is no match, default to "IT"
        const vectaUserId = await searchVectaUserByName(winnerProjectUser);
        console.log(`Vecta user GUID is: ${vectaUserId}`);

        // Create Project in Vecta
        const vectaProjectId = await createVectaProject({
            "name": winnerProjectData.projectName,
            // "description": winnerProjectData.projectId.toString(), // Attempting to UD Values, below
            "workflowId": "ad14bd95-96ea-4972-8081-83b8790b36d6",
            "ownerId": vectaUserId,
            "assignedToId": vectaUserId
        });
        console.log(`Vecta project data: ${vectaProjectId}`);

        // Refer to Winner Shop ID, return name of Shop
        const winnerShopName = await referToWinnerShopById(winnerShopGuid);

        // Add User-Defined (custom) values to Vecta Project // WORK IN PROGRESS
        const udValuesData = [
            {
                "id": config.vectaUdValues.flexProjectNoId,
                "value": winnerProjectData.projectId.toString()
            },
            {
                "id": config.vectaUdValues.routeToMarketId,
                "value": winnerShopName
            }
        ];
        const updatedVectaUdValues = await updateVectaUdValues(vectaProjectId, udValuesData);

        // Get new Vecta Project number
        const vectaProjectData = await getVectaProject(vectaProjectId);
        const vectaProjectNo = vectaProjectData.projectNo;
        console.log(vectaProjectNo);

        // Add Vecta Project number to Winner Project's External Unique ID field - this then links the two projects
        winnerProjectData.externalUniqueID = vectaProjectNo
        const winnerProjectLinked = await updateWinnerProject(winnerProjectData.projectGuid, winnerProjectData.shopGuid, winnerProjectData);

        // Confirm project creation success to Winner
        console.log("Project created successfully!")
        res.status(200).json({ message: 'Project created successfully!' });

    } catch (error) {

        logError(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};

module.exports = handleProjectCreated;
