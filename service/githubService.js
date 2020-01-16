const axios = require('axios');
const config = require('../config/config');

module.exports.getUserRepositoryInfo = async function (username) {

    let userRepoList = [];
    let userReposResult = await fetchUserRepositories(username);

    for (const repository of userReposResult.data) {

        let repoInfo = {
            name: repository.name,
            owner: repository.owner.login,
            branches: []
        }
        let repositoryBranchesResult = await fetchRepositoryBranches(username, repository.name);

        for (const branch of repositoryBranchesResult.data) {

            let branchInfo = {
                name: branch.name,
                lastCommitSHA: branch.commit.sha
            }
            repoInfo.branches.push(branchInfo);
        }

        if (!repository.fork) {
            userRepoList.push(repoInfo);
        }
    }

    return userRepoList;
}


function fetchUserRepositories(username) {

    let url = config.githubApi.baseUrl + config.githubApi.userReposEndpoint.replace(':username', username);

    return axios.get(url, {
        auth: {
            username: config.githubApi.username,
            password: config.githubApi.personalAccessToken
        },
        headers: {
            Accept: config.githubApi.defaultV3AcceptHeader
        }
    }).then((response) => {
        return response;
    })
        .catch((err) => {
            return err.response;
        });
}

function fetchRepositoryBranches(owner, repo) {

    let url = config.githubApi.baseUrl + config.githubApi.repoBranchesEndpoint.replace(':owner', owner).replace(':repo', repo);

    return axios.get(url, {
        auth: {
            username: config.githubApi.username,
            password: config.githubApi.personalAccessToken
        },
        headers: {
            Accept: config.githubApi.defaultV3AcceptHeader
        }
    }).then((response) => {
        return response;
    })
        .catch((err) => {
            return err.response;
        });

}