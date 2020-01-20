const githubService = require('./githubService');

//Default unexpected error message
const unexpectedErrorMessage = 'An unexpected error occurred getting user repository info';

//Default error response object
let errorResponse = {
    status: '',
    message: ''
}

/**
 * Builds a list of repositories for the given user, each repository object contains a list of it's branches
 * 
 * @param {string} username 
 */
async function getUserRepositoryInfo(username) {

    try {
        //Initialize the response object
        let userRepoList = [];

        let getUserReposResponse = await githubService.fetchGithubUserRepositories(username);

        //Return error response if the service call didn't return status 200
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

            let getRepositoryBranchesResponse = await githubService
                .fetchGithubRepositoryBranches(username, repository.name);

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
        console.error(unexpectedErrorMessage);
        console.error(err.message);
        errorResponse.status = 500;
        errorResponse.message = unexpectedErrorMessage;

        return errorResponse;
    }
}

module.exports.getUserRepositoryInfo = getUserRepositoryInfo;