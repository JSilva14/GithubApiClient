const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const assert = chai.assert;
const sinon = require('sinon');
const mCache = require('memory-cache');
const expressValidator = require('express-validator');

const server = require('../../../index');
const service = require('../../../service/service');

chai.use(chaiHttp);

const username = 'testgithub-node';
const inexistentUsername = '-----';
const acceptHeader = 'Accept';
const applicationJson = 'application/json';
const applicationXml = 'application/xml';

const mockValidResponse = '[{"name":"test","owner":"testgithub-node",'
    + '"branches":[{"name":"master","lastCommitSHA":"d6fa3a0fe73417292c31b64d91c39282c1db741d"}]},'
    + '{"name":"test2","owner":"testgithub-node",'
    + '"branches":[{"name":"master","lastCommitSHA":"4fc980a9b3f8861de848695ec8bbae15fbfac3e5"}]}]';

const mockInvalidHeaderResponse = '{"status":406,"message":"Accept header should be application/json"}';

const mockNotFoundResponse = '{"status":404,"message":"Not Found"}';


describe("ROUTE INTEGRATION TESTS", function () {

    describe("GET /api/user/:username", function () {

        //increase the default mocha timeout from 2 seconds to 15
        //since these tests perform http calls which can take longer than 2 seconds
        this.timeout(15000);

        //clear the cache before starting the tests
        before(function(){
           mCache.clear(); 
        });

        //Clear cache after each test
        afterEach(function () {
            mCache.clear();
        })

        it("Valid request should return status 200 and repository information for given user", (done) => {

            chai.request(server)
                .get(`/api/user/${username}`)
                .set(acceptHeader, applicationJson)
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(JSON.stringify(res.body), mockValidResponse);
                    done();
                });
        });

        it("Invalid Header should return status 406 and appropriate message", (done) => {
            chai.request(server)
                .get(`/api/user/${username}`)
                .set(acceptHeader, applicationXml)
                .end((req, res) => {
                    res.should.have.status(406);
                    assert.equal(JSON.stringify(res.body), mockInvalidHeaderResponse);
                    done();
                });
        });

        it("Inexistent username should return status 404 and appropriate message", (done) => {
            chai.request(server)
                .get(`/api/user/${inexistentUsername}`)
                .set(acceptHeader, applicationJson)
                .end((req, res) => {
                    res.should.have.status(404);
                    assert.equal(JSON.stringify(res.body), mockNotFoundResponse);
                    done();
                });
        });

        it("Should store successful responses in cache if they don't already exist", (done) => {
            chai.request(server)
                .get(`/api/user/${username}`)
                .set(acceptHeader, applicationJson)
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(mCache.get(username), mockValidResponse);
                    done();
                });

        });

        it("Should get response from cache if it exists for the provided username", (done) => {

            mCache.put(username, mockValidResponse);

            let serviceSpy = sinon.spy(service);

            chai.request(server)
                .get(`/api/user/${username}`)
                .set(acceptHeader, applicationJson)
                .end((req, res) => {
                    res.should.have.status(200);
                    assert.equal(JSON.stringify(res.body), mockValidResponse);
                    assert(serviceSpy.getUserRepositoryInfo.notCalled,
                        'Data was not retrieved from cache. An http call was made to github');
                    done();
                });
        });
    });
});