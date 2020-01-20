const sinon = require('sinon');
const chai = require('chai');
const assert = chai.assert;
const mockReqRes = require('mock-req-res');
const repositoryController = require('../../../api/controllers/repositoryController');
const apiService = require('../../../service/apiService');


describe('REPOSITORY CONTROLLER Unit Tests', function () {

    describe('REPOSITORY CONTROLLER getUserRepositoryInfo', function () {

        //Req and Res objects to be passed to controller
        let req;
        let res;

        let apiServiceStub;

        this.beforeEach(function () {
            //Mock req and res 
            req = mockReqRes.mockRequest();
            res = mockReqRes.mockResponse();
            //Replace apiService with a stub which will be called by controller 
            //instead of the actual apiService
            apiServiceStub = sinon.stub(apiService, "getUserRepositoryInfo");
        });

        this.afterEach(function () {
            //Restore the stub so the following tests use the actual service if necessary
            apiServiceStub.restore();
        });

        it('Should call res.status to set the same value as the one obtained in response.status if it exists',
            async () => {

                //Mock response from apiService.getUserRepositoryInfo
                const mockApiServiceResponse = {
                    body: 'mockBody',
                    status: 200
                };

                //Make apiServiceStub resolve with the mock response when called by the controller
                apiServiceStub.resolves(mockApiServiceResponse);

                //Call the controller
                await repositoryController.getUserRepositoryInfo(req, res);

                //Check if res.status was called with the correct value
                assert(res.status.calledWith(mockApiServiceResponse.status), 'res.status was not called');

            });

        it('Should send 500 and default error response if apiService.getUserRepositoryInfo rejects',
            async () => {

                //Default unexpected error message
                const unexpectedErrorString = 'An unexpected error occurred getting user repository info';

                //Default error response object
                var errorResponse = {
                    status: 500,
                    message: unexpectedErrorString
                }

                //Make apiServiceStub reject when called by the controller
                apiServiceStub.rejects(new Error('mockError'));

                //Call the controller
                try {
                    await repositoryController.getUserRepositoryInfo(req, res);
                } catch (err) {
                    //Check if res.send was called with the default error response as argument
                    assert(res.send.calledWith(errorResponse),
                        'res.send was not called with correct response or not called at all');
                    //Check if res.status was called with 500
                    assert(res.status.calledWith(500),
                        'res.status was not called or not called with 500');
                }
            });

            it('Should not call res.status if response.status does not exist',
            async () => {

                //Mock response from apiService.getUserRepositoryInfo with no status property
                const mockApiServiceResponse = {
                    body: 'mockBody'
                };

                //Make apiServiceStub resolve with the mock response when called by the controller
                apiServiceStub.resolves(mockApiServiceResponse);

                //Call the controller
                await repositoryController.getUserRepositoryInfo(req, res);

                //Check if res.status was called with the correct value
                assert(res.status.notCalled, 'res.status() was called');
            });
    });

});