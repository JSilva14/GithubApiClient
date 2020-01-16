const config = {};

config.api = {};
config.api.PORT = process.env.PORT || 3000;

config.githubApi = {}; 

config.githubApi.baseUrl = 'https://api.github.com';
config.githubApi.defaultV3AcceptHeader = 'application/vnd.github.v3+json';
config.githubApi.userReposEndpoint = '/users/:username/repos';
config.githubApi.repoBranchesEndpoint = '/repos/:owner/:repo/branches';

module.exports = config;
