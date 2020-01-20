const apiService = require('../../service/apiService');

//Default unexpected error message
const unexpectedErrorMessage = 'An unexpected error occurred getting user repository info';

//Default error response object
var errorResponse = {
    status: '',
    message: ''
}

/**
 * Calls apiService.getUserRepositoryInfo and performs res.send() with the response
 * 
 * @param {*} req 
 * @param {*} res 
 */
function getUserRepositoryInfo(req, res) {
    
        apiService.getUserRepositoryInfo(req.params.username).then((response) => {
            
         /* Check if the response is an error message (only error messages contain status)
            and set the actual HTTP status of res equal to the error status. 
            Otherwise it would always be 200.  */
            if(response.hasOwnProperty('status')){
                res.status(response.status);
            }

            res.send(response);
        })
        .catch((err) => {
            console.error(unexpectedErrorMessage);
            console.error(JSON.stringify(err));

            errorResponse.status=500;
            errorResponse.message=unexpectedErrorMessage;
            res.status(500).send(errorResponse);
        }); 
}

module.exports.getUserRepositoryInfo = getUserRepositoryInfo;