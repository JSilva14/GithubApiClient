const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repositoryController');

router.get('/user/:username', repoController.getUserRepositoryInfo);

module.exports = router;