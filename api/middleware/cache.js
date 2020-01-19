const mCache = require('memory-cache');

function cache(duration){
    return (req, res, next) => {
      let key = req.params.username;
      let cachedBody = mCache.get(key);
      if (cachedBody) {
        res.send(JSON.parse(cachedBody));
        return;
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          mCache.put(key, body, duration * 1000);
          res.sendResponse(body);
        }
        next();
      }
    }
  }

  const getCachedValue = (key) => {
    let cachedBody = mCache.get(key);
    if (cachedBody) {
      return cachedBody;
    }
  }

  module.exports.cache = cache;
  module.exports.getCachedValue = getCachedValue;
