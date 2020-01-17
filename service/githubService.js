const axios = require('axios');
const config = require('../config/config');

//Default unexpected error message
const unexpectedErrorString = 'An unexpected error occurred getting user repository info';

//Default error response object
var errorResponse = {
    status: 500,
    message: unexpectedErrorString
}

/**
 * Builds a list of repositories for the given user, each repository object contains a list of it's branches
 * 
 * @param {string} username 
 */
async function getUserRepositoryInfo(username) {

    try {
        let userRepoList = [];
        let getUserReposResponse = await fetchGithubUserRepositories(username);

        if (getUserReposResponse.hasOwnProperty('status') && getUserReposResponse.status != 200) {

            errorResponse.status = getUserReposResponse.status;
            errorResponse.message = getUserReposResponse.statusText;
            return errorResponse;
        }

        for (const repository of getUserReposResponse.data) {

            let repoInfo = {
                name: repository.name,
                owner: repository.owner.login,
                branches: []
            }

            let getRepositoryBranchesResponse = await fetchGithubRepositoryBranches(username, repository.name);

            if (getRepositoryBranchesResponse.hasOwnProperty('status') &&
                getRepositoryBranchesResponse.status != 200) {

                errorResponse.status = getRepositoryBranchesResponse.status;
                errorResponse.message = getRepositoryBranchesResponse.statusText;
                return errorResponse;
            }

            for (const branch of getRepositoryBranchesResponse.data) {

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

    } catch (err) {
        console.log('An unexpected error occurred getting user repository info');
        console.log(err.message);

        return errorResponse;
    }
}

/**
 * Makes a request to the Github API to fetch all repositories owned by the given user
 * 
 * @param {string} username username of the user whose repository list we want to fetch
 * @returns An object that contains the result of the request
 */
function fetchGithubUserRepositories(username) {

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

            if (err.response) {
                console.log('Error while fetching user repositories');
                console.log(`Status: ${err.response.status}`);
                console.log(`Response: ${JSON.stringify(err.response.data)}`);

                return err.response;

            } else {
                console.log('Unexpected error fetching user repositories');
                console.log(error.message);

                return err.response;
            }

        });
}

/**
 * Makes a request to the Github API to fetch all branches (that are not forks) 
 * that correspond to the given repository and owner
 * 
 * @param {string} owner The username of the repository owner
 * @param {string} repository The repository whose branches we want to fetch
 * @returns An object that contains the result of the request
 */
function fetchGithubRepositoryBranches(owner, repository) {

    let url =
        config.githubApi.baseUrl +
        config.githubApi.repoBranchesEndpoint.replace(':owner', owner).replace(':repo', repository);

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

module.exports.getUserRepositoryInfo = getUserRepositoryInfo;