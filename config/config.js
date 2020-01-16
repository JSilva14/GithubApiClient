const config = {

    api: {
        PORT: process.env.PORT || 3000,
    },
    
    githubApi: {
        username: 'testgithub-node',
        personalAccessToken: '58ebef33c9b294639ab99a61fc40ae4797ad1fcb',
        baseUrl: 'https://api.github.com',
        defaultV3AcceptHeader: 'application/vnd.github.v3+json',
        userReposEndpoint: '/users/:username/repos',
        repoBranchesEndpoint: '/repos/:owner/:repo/branches'
    }
};

module.exports = config;