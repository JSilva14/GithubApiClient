const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const axios = require('axios');
const assert = chai.assert;
const githubService = require('../../service/githubService');


describe('GITHUB SERVICE Unit Tests', function () {

    describe('GITHUB SERVICE getUserRepositoryInfo', function () {

        it('fetchGithubUserRepositories gets correct response', async () => {

                //Since the response to this request is too large, we only check if the number and name 
                //of repositories is correct to prevent excess clutter
                let expectedRepositoryNumber = 2;
                let expectedRepositoryNames = ['test', 'test2'];

                let actualRepositoryNames = [];

                let fetchGithubUserRepositoriesResult = await githubService.fetchGithubUserRepositories('testgithub-node');

                actualRepositoryNames.push(fetchGithubUserRepositoriesResult.data[0].name, fetchGithubUserRepositoriesResult.data[1].name);

                //Check if the response is correct
                assert.equal(fetchGithubUserRepositoriesResult.data.length, expectedRepositoryNumber);
                assert.equal(JSON.stringify(actualRepositoryNames), JSON.stringify(expectedRepositoryNames));
            }); 
        
        it('fetchGithubRepositoryBranches gets correct response', async () => {

                let expectedResponse = '[{"name":"master",' +
                    '"commit":{' +
                    '"sha":"d6fa3a0fe73417292c31b64d91c39282c1db741d",' +
                    '"url":"https://api.github.com/repos/testgithub-node/test/commits/d6fa3a0fe73417292c31b64d91c39282c1db741d"},' +
                    '"protected":false}]';


                let fetchGithubRepositoryBranchesResult = await githubService.fetchGithubRepositoryBranches('testgithub-node', 'test');

                //Check if the response is correct
                assert.equal(JSON.stringify(fetchGithubRepositoryBranchesResult.data), expectedResponse);
            });
    });

});