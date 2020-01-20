const githubService = require('./github');

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
        let getUserReposResponse = await githubService.fetchGithubUserRepositories(username);

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
        console.error(unexpectedErrorString);
        console.error(err.message);

        return errorResponse;
    }
}

module.exports.getUserRepositoryInfo = getUserRepositoryInfo;