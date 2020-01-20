const chai = require('chai');
const should = chai.should();
const assert = chai.assert;
const sinon = require('sinon');
const mCache = require('memory-cache');
const mockReqRes = require('mock-req-res');
const cache = require('../../../api/middleware/cache');

const username = 'testgithub-node';
const mockResponseBody = '{"mockResponseBody": "mockResponseBody"}';
const cacheDurationMiliseconds = 5000;

describe("CACHE UNIT TESTS", function () {

    let req;
    let res;

    //clear the cache before starting the tests
    before(function () {
        mCache.clear();
    });

    //Clear cache after each test
    afterEach(function () {
        mCache.clear();
    });

    it("Should store response body if it is not already cached for the provided username", (done) => {

        req = mockReqRes.mockRequest({params: {username: username}});
        res = mockReqRes.mockResponse({body: mockResponseBody});
        
        //call cache middleware using mocked req and res
        cache.cache(cacheDurationMiliseconds)(req, res, ()=>{});
        res.send(mockResponseBody);
        
        //check that the response obtained was stored in the cache with username as the key
        assert.equal(mCache.get(username), res.body);
        done();
    });

    it("Should NOT store response body if it is already cached for the provided username", (done) => {

        //cache the mockResponseBody using username as key
        mCache.put(username, mockResponseBody);

        //create a spy to check if mCache.put is called again
        let cacheSpy = sinon.spy(mCache);

        req = mockReqRes.mockRequest({params: {username: username}});
        res = mockReqRes.mockResponse({body: mockResponseBody});
        
        //call cache middleware using mocked req and res
        cache.cache(cacheDurationMiliseconds)(req, res, ()=>{});
        res.send(mockResponseBody);

        assert(cacheSpy.put.notCalled,
            'Response was stored again in cache even though it already existed');        

        done();
    });

});