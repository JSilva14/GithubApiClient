const service = require('../service/service');

module.exports.getUserRepositoryInfo = function (req, res) {

        service.getUserRepositoryInfo(req.params.username)
        .then((response) => {
            //console.log(response);
            res.send(response);
        })
        .catch((err) => {
            //console.error(err);
            res.send(err);
        }); 
}