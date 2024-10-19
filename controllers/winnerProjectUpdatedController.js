const { filterWinnerProjects, getWinnerProject, updateWinnerProject, createWinnerProject, getWinnerProjectTypeGuids, getWinnerProjectStatusGuids, getWinnerShops, getWinnerCompanyUsers, getWinnerUserById } = require('../services/winnerService');
const { getVectaCompanyById, getVectaCompanyByAccountNo, getVectaProject, createVectaProject, updateVectaProject, searchVectaProject, getVectaUser, searchVectaUsers, getVectaWorkflowStage } = require('../services/vectaService');

const handleProjectUpdated = async (req, res) => {

    try {

        console.log("Testing Project Update")
        // Confirm project creation success to Winner
        res.status(200).json({ message: 'Project updated successfully!' });
        
    } catch (error) {

        logError(error);
        res.status(500).json({ message: 'Internal server error' });

    }

};

module.exports = handleProjectUpdated;
