const { filterWinnerProjects, getWinnerProject, updateWinnerProject, createWinnerProject, getWinnerProjectTypeGuids, getWinnerProjectStatusGuids, getWinnerCompetitorName, getWinnerShops, getWinnerCompanyUsers, getWinnerUserById } = require('../services/winnerService');
const { getVectaCompanyById, getVectaCompanyByAccountNo, getVectaProject, createVectaProject, updateVectaProject, searchVectaProject, updateVectaUdValues, getVectaUser, searchVectaUserByName, getVectaWorkflowStage, getVectaStatusByWinnerStatus } = require('../services/vectaService');
const { logError, validateWebhookData, parseWebhookData, readWorkflowStatuses } = require('../utils/utils');
const config = require('../config/config');

const handleProjectUpdated = async (req, res) => {

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
            console.log("Webhook data is valid - project update route")
        }

        // Get new Winner project's projectGuid and shopGuid from webhook subject
        const { winnerProjectGuid, winnerShopGuid } = await parseWebhookData(req.body);

        // STOPS IF NOT TEST SHOP - REMOVE TO ENABLE OTHER ROUTES TO MARKET (pauses designer requests during development)
        if (winnerShopGuid != config.winnerShops.testShopId) {
            console.log("Request not from test shop - aborting!")
            res.status(200).json({ message: 'Aborting: not a test shop request' });
            return;
        }
        
        // Get Winner Project data
        const winnerProjectData = await getWinnerProject(winnerProjectGuid, winnerShopGuid);
        console.log(`WINNER REFERENCE FOR VECTA PROJECT ID: ${winnerProjectData.externalUniqueID}`)

        if (!winnerProjectData.externalReference) {
            console.log("Winner project must have valid external reference (company accountNo) to continue. Terminating project update.");
            res.status(200).json({ message: 'Project updated terminated (no company account no. available).' });
            return;''
        }

        if (!winnerProjectData.externalUniqueID) {
            console.log("Winner project must have valid external unique ID (Vecta Project No.) to continue. Terminating project update.");
            res.status(200).json({ message: 'Project updated terminated (no Vecta Project ID reference available).' });
            return;
        }

        // Get Vecta Workflow Status Id - by Winner Workflow status Id
        const vectaProjectStatusId = await getVectaStatusByWinnerStatus(winnerProjectData.status_StandardText);
        console.log(`Vecta project status ID is: ${vectaProjectStatusId}`)

        // Get Vecta Company ID
        const vectaCompanyId = await getVectaCompanyByAccountNo(winnerProjectData.externalReference);
        console.log(`Vecta company ID is: ${vectaCompanyId}`)

        // EXTERNAL UNIQUE ID HAS DISAPPEARED BY NOW

        // Get Vecta Project GUID by Searching for Project No.

        const vectaProjectId = await searchVectaProject(winnerProjectData.externalUniqueID);

        // Get Vecta Project Data
        const vectaProjectData = await getVectaProject(vectaProjectId);
        console.log(vectaProjectData);

        // Format the data for Vecta Project update
        const updatedVectaProjectData = {
            id: vectaProjectData.id, //ok
            name: winnerProjectData.projectName, //ok
            projectNo: vectaProjectData.projectNo, //ok
            description: winnerProjectData.extraInformation, //ok for now - update later once UD API is sorted
            workflowId: vectaProjectData.workflowId, //ok
            workflowStageId: vectaProjectStatusId, //ok
            primaryCompanyId: vectaCompanyId, //ok
            primaryContactIds: [], //revisit later
            estimatedValue: winnerProjectData.budgetValue || 0,
            expectedValue: 0.0,
            weightedValue: 0.0,
            percentComplete: 0,
            durationLength: null,
            durationType: "Days",
            ownerId: vectaProjectData.ownerId,
            ownerName: vectaProjectData.ownerName,
            assignedToId: vectaProjectData.assignedToId,
            assignedToName: vectaProjectData.assignedToName,
            startDateTime: null,
            dueDateTime: null,
            actionDateTime: null,
            createdDateTime: vectaProjectData.createdDateTime,
            modifiedDateTime: vectaProjectData.modifiedDateTime,
            createdById: vectaProjectData.createdById,
            modifiedById: vectaProjectData.modifiedById,
            lastTransitionDateTime: new Date().toISOString(),
        };

        // Update Vecta Project
        const updatedVectaProject = await updateVectaProject(updatedVectaProjectData);

        // Handle Lost to Competitor Status
        const competitorName = await getWinnerCompetitorName(winnerProjectData.lostToCompetitor_StandardText);
        const udValuesData = [
            {
                "id": config.vectaUdValues.lostToCompetitorId,
                "value": competitorName
            }
        ]
        const updatedVectaUdValues = await updateVectaUdValues(vectaProjectId, udValuesData);

        // Confirm project update success to Winner
        console.log("Project updated successfully!")
        res.status(200).json({ message: 'Project updated successfully!' });
        
    } catch (error) {

        logError(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};

module.exports = handleProjectUpdated;
