const githubService = require('../service/githubService');

module.exports.getUserRepositoryInfo = function (req, res) {

        githubService.getUserRepositoryInfo(req.params.username)
        .then((response) => {
            //console.log(response);
            res.send(response);
        })
        .catch((err) => {
            //console.error(err);
            res.send(err);
        }); 
}