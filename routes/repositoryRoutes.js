const express = require('express');
const router = express.Router();
const repoController = require('../controllers/repositoryController');
const {requestValidationRules, validate} = require('../validators/validator');

router.get('/user/:username', requestValidationRules(), validate, repoController.getUserRepositoryInfo);

module.exports = router;