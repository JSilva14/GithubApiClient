const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repositoryController');
const { requestValidationRules, validate } = require('../middleware/requestValidator');
const {cache} = require('../middleware/cache');

router.get('/user/:username', requestValidationRules(), validate, cache(120000),
    repoController.getUserRepositoryInfo);

module.exports = router;