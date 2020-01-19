const service = require('../../service/service');

function getUserRepositoryInfo(req, res) {

        service.getUserRepositoryInfo(req.params.username).then((response) => {
            
         /* Check if the response is an error message (only error messages contain status)
            and set the actual HTTP status of res equal to the error status. 
            Otherwise it would always be 200.  */
            if(response.hasOwnProperty('status')){
                res.status(response.status);
            }

            res.send(response);
        })
        .catch((err) => {
            //console.error(err);
            res.send(err);
        }); 
}

module.exports.getUserRepositoryInfo = getUserRepositoryInfo;