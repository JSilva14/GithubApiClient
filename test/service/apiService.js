const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const apiService = require('../../service/apiService');
const githubService = require('../../service/githubService');


describe('API SERVICE Unit Tests', function () {

    describe('API SERVICE getUserRepositoryInfo', function () {

        let githubServiceStub = {};

        this.beforeEach(function () {
            //Replace githubService with a stub which will be called by apiService 
            //instead of the actual githubService
            githubServiceStub.fetchUserRepositories =
                sinon.stub(githubService, "fetchGithubUserRepositories");
            githubServiceStub.fetchRepositoryBranches =
                sinon.stub(githubService, "fetchGithubRepositoryBranches");
        });

        this.afterEach(function () {
            //Restore the stub so the following tests use the actual service if necessary
            githubServiceStub.fetchRepositoryBranches.restore();
            githubServiceStub.fetchUserRepositories.restore();
        });


        it('Should return user repositoryInfo if githubService sends valid responses',
            async () => {

                let validFetchGithubUserRepositoriesResponse = {
                    data: [{
                        "name": "mockRepo",
                        "owner": {
                            "login": "mockLogin",
                        }
                    }]
                };

                let validFetchRepositoryBranchesResponse = {
                    data: [{
                        "name": "mockBranch",
                        "commit": {
                            "sha": "mockSha"
                        },
                    }]
                };

                let expectedResponse = '[{"name":"mockRepo","owner":"mockLogin",' +
                    '"branches":[{"name":"mockBranch","lastCommitSHA":"mockSha"}]}]';

                //Make githubServiceStub return mocked responses
                githubServiceStub.fetchUserRepositories.returns(validFetchGithubUserRepositoriesResponse);
                githubServiceStub.fetchRepositoryBranches.returns(validFetchRepositoryBranchesResponse);

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if the response is correct
                assert.equal(JSON.stringify(getUserRepositoryInfoResult), expectedResponse);

            });

        it('Should call githubService.fetchGithubRepositoryBranches for each repository retrieved',
            async () => {

                let validFetchGithubUserRepositoriesResponse = {
                    data: [{
                            "name": "mockRepo1",
                            "owner": {
                                "login": "mockLogin",
                            }
                        },
                        {
                            "name": "mockRepo2",
                            "owner": {
                                "login": "mockLogin",
                            }
                        }
                    ]
                };

                let validFetchRepositoryBranchesResponse = {
                    data: [{
                        "name": "mockBranch",
                        "commit": {
                            "sha": "mockSha"
                        },
                    }]
                };

                let expectedCallCount = 2;

                //Make githubServiceStub return mocked responses
                githubServiceStub.fetchUserRepositories.returns(validFetchGithubUserRepositoriesResponse);
                githubServiceStub.fetchRepositoryBranches.returns(validFetchRepositoryBranchesResponse);

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if fetchRepositoryBranches was called the expected amount of times
                assert.equal(githubServiceStub.fetchRepositoryBranches.callCount, expectedCallCount);

            });

            it('Should ignore fork branches',
            async () => {

                let validFetchGithubUserRepositoriesResponse = {
                    data: [{
                            "name": "mockRepo1",
                            "owner": {
                                "login": "mockLogin",
                            },
                            fork: true
                        },
                        {
                            "name": "mockRepo2",
                            "owner": {
                                "login": "mockLogin",
                            }
                        }
                    ]
                };

                let validFetchRepositoryBranchesResponse = {
                    data: [{
                        "name": "mockBranch",
                        "commit": {
                            "sha": "mockSha"
                        },
                    }]
                };

                //Expected response should not have the repository with fork:true
                let expectedResponse = '[{"name":"mockRepo2","owner":"mockLogin",' +
                    '"branches":[{"name":"mockBranch","lastCommitSHA":"mockSha"}]}]';

                //Make githubServiceStub return mocked responses
                githubServiceStub.fetchUserRepositories.returns(validFetchGithubUserRepositoriesResponse);
                githubServiceStub.fetchRepositoryBranches.returns(validFetchRepositoryBranchesResponse);

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if the response is correct
                assert.equal(JSON.stringify(getUserRepositoryInfoResult), expectedResponse);
            });

        it('If githubservice.fetchGithubUserRepositories status is not 200, should return error message with the correct status',
            async () => {

                let failedFetchGithubUserRepositoriesResponse = {
                    status: 500
                };

                //Make githubServiceStub return mocked responses
                githubServiceStub.fetchUserRepositories.returns(failedFetchGithubUserRepositoriesResponse);

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if the response status is correct
                assert.equal(getUserRepositoryInfoResult.status, failedFetchGithubUserRepositoriesResponse.status);

            });

        it('If githubservice.fetchRepositoryBranches status is not 200, should return error message with the correct status',
            async () => {

                let failedFetchRepositoryBranchesResponse = {
                    status: 500
                };

                //Make githubServiceStub return mocked responses
                githubServiceStub.fetchRepositoryBranches.returns(failedFetchRepositoryBranchesResponse);

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if the response status is correct
                assert.equal(getUserRepositoryInfoResult.status, failedFetchRepositoryBranchesResponse.status);

            });

        it('Should return default error response object if githubService.fetchGithubUserRepositories returns an error',
            async () => {

                //Default unexpected error message
                const unexpectedErrorString = 'An unexpected error occurred getting user repository info';

                //Default error response object
                let errorResponse = {
                    status: 500,
                    message: unexpectedErrorString
                }

                //Make githubServiceStub.fetchUserRepositories return an error
                githubServiceStub.fetchUserRepositories.returns(new Error('mockError'));

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if the response is correct
                assert.equal(JSON.stringify(getUserRepositoryInfoResult), JSON.stringify(errorResponse));

            });


        it('Should return default error response object if githubService.fetchRepositoryBranches returns an error',
            async () => {

                //Default unexpected error message
                const unexpectedErrorString = 'An unexpected error occurred getting user repository info';

                //Default error response object
                let errorResponse = {
                    status: 500,
                    message: unexpectedErrorString
                }

                //Make githubServiceStub resolve with the mock response when called by the controller
                githubServiceStub.fetchRepositoryBranches.returns(new Error('mockError'));

                let getUserRepositoryInfoResult = await apiService.getUserRepositoryInfo('mockUser');

                //Check if the response is correct
                assert.equal(JSON.stringify(getUserRepositoryInfoResult), JSON.stringify(errorResponse));

            });
    });

});