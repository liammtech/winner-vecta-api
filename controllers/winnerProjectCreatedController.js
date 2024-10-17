const { filterWinnerProjects, getWinnerProject, updateWinnerProject, createWinnerProject, getWinnerProjectTypeGuids, getWinnerProjectStatusGuids, getWinnerShops, getWinnerCompanyUsers, getWinnerUserById } = require('../services/winnerService');
const { getVectaCompanyById, getVectaCompanyByAccountNo, getVectaProject, createVectaProject, updateVectaProject, searchVectaProject, getVectaUser, searchVectaUsers, getVectaWorkflowStage } = require('../services/vectaService');

const handleProjectCreated = async (req, res) => {
    console.log("Project created!")
};

module.exports = handleProjectCreated;
