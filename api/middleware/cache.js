const mCache = require('memory-cache');

/**
 * Checks if there is a cached response using req.params.username as key.
 * If a response is cached for the specified key, sends the response.
 * If a response is not cached for the specified key, modifies res.send so that it caches 
 * the response when it is called
 * 
 * Data is cached for the duration specified
 * 
 * @param {integer} durationMiliseconds 
 */
function cache(durationMiliseconds){
    return (req, res, next) => {
      // check if response exists for this key
      let key = req.params.username;
      let cachedBody = mCache.get(key);
      if (cachedBody) {
        //If response is cached send it
        console.log('Retrieved response from cache');
        res.send(JSON.parse(cachedBody));
        return;
      } else {
        //If response is not cached, modify res.send so that it performs mCache.put 
        //when it is called by the next middleware
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
