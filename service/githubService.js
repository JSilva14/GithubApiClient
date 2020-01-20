const axios = require('axios');
const config = require('../config/config');

const errorFetchingRepositories = 'Error while fetching user repositories';
const errorFetchingBranches = 'Error while fetching repository branches';
const unexpectedErrorMessage = 'Unexpected error fetching user repositories';


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
                console.error(errorFetchingRepositories);
                console.error(`Status: ${err.response.status}`);
                console.error(`Response: ${JSON.stringify(err.response.data)}`);

                return err.response;

            } else {
                console.error(unexpectedErrorMessage);
                console.error(error.message);

                return err.message;
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

            if (err.response) {
                console.error(errorFetchingBranches);
                console.error(`Status: ${err.response.status}`);
                console.error(`Response: ${JSON.stringify(err.response.data)}`);

                return err.response;

            } else {
                console.error(unexpectedErrorMessage);
                console.error(error.message);

                return err.message;
            }
        });

}

module.exports.fetchGithubUserRepositories = fetchGithubUserRepositories;
module.exports.fetchGithubRepositoryBranches = fetchGithubRepositoryBranches;