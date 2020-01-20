const mCache = require('memory-cache');


function cache(durationMiliseconds){
    return (req, res, next) => {
      let key = req.params.username;
      let cachedBody = mCache.get(key);
      if (cachedBody) {
        console.log('Retrieved response from cache');
        res.send(JSON.parse(cachedBody));
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          mCache.put(key, body, durationMiliseconds);
          res.sendResponse(body);
        }
        next();
      }
    }
  }

  module.exports.cache = cache;
