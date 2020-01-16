const axios = require('axios');
const config = require('../config/config');



module.exports.buildUserRepoList = async function (username) {

    let repoList = [];

    let repoInfo = {
        name: "",
        owner: "",
        branches: []
    };

    let branchInfo = {
        name: "",
        lastCommitSHA: ""
    }

    let userRepositoriesResult = await getUserRepositories(username);

    userRepositoriesResult.data.forEach(async repo => {
        repoInfo.owner = repo.owner.login;
        repoInfo.name = repo.name;
        await getRepositoryBranches(username, repo.name)
            .then((branchList) => {
                branchList.data.forEach((branch) => {
                    branchInfo.name=branch.name;
                    branchInfo.lastCommitSHA=branch.commit.sha;

                    repoInfo.branches.push(branchInfo);
                });

                
            })
            .catch((err) => {
                console.error(err);
                //res.send(err.response);
            });

            repoList.push(repoInfo);
    });

    return repoInfo;
}

function getUserRepositories(username) {

    let url = config.githubApi.baseUrl + config.githubApi.userReposEndpoint.replace(':username', username);

    return axios.get(url, {
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

function getRepositoryBranches(owner, repo) {

    let url = config.githubApi.baseUrl + config.githubApi.repoBranchesEndpoint.replace(':owner', owner).replace(':repo', repo);

    return axios.get(url, {
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