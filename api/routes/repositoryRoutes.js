const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repositoryController');
const { requestValidationRules, validate } = require('../middleware/requestValidator');
const {cache} = require('../middleware/cache');
const config = require('../../config/config');

//Get user repository info route
router.get('/user/:username', requestValidationRules(), validate, cache(config.api.cacheDuration),
    repoController.getUserRepositoryInfo);

module.exports = router;