const express = require('express');
const router = express.Router();

const handleProjectCreated = require('../controllers/winnerProjectCreatedController');
const handleProjectUpdated = require('../controllers/winnerProjectUpdatedController');

// Log whenever these endpoints are hit
router.post('/project-created', (req, res, next) => {
    console.log("Hit /project-created");
    handleProjectCreated(req, res);
});

router.post('/project-updated', (req, res, next) => {
    console.log("Hit /project-updated");
    handleProjectUpdated(req, res);
});

module.exports = router;
