const githubService = require('../service/githubService');

module.exports.getUserRepositoryInfo = function (req, res) {
    githubService.buildUserRepoList(req.params.username)
        .then((response) => {
            console.log(response);
            res.send(response.data);
        })
        .catch((err) => {
            console.error(err);
            res.send(err);
        });
}