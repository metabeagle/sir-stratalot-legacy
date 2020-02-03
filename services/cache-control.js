const {promisify}   = require('util'),
      url           = require('url'),
      keys          = require('../config/keys'),
      cacheManager  = require('cache-manager'),
      redisStore    = require('cache-manager-redis-store');

const redisCache = cacheManager.caching({
  store: redisStore,
  host: url.parse(keys.redisCacheUrl).hostname,
  port: url.parse(keys.redisCacheUrl).port,
  auth_pass: url.parse(keys.redisCacheUrl).auth.split(':')[1]
});

const redisClient = redisCache.store.getClient();

redisClient.on("connect", function(err) {
  if(err) {
    console.log('error: ' + err);
  } else {
    console.log('connected to redis cache');
  }
});

redisClient.on("error", function(err) {
  console.log("error " + err);
});

const cacheControl = {
  createKey: (path) => {
    return `${keys.cachePrefix}:${path}`;
  },
  referUrl: (url) => {
    require('url').parse(url).pathname;
  },
  delOne: (key) => {
    redisCache.del(key, (err) => {
      if(err){
        console.log(err);
      } else {
        console.log(`deleted ${key} from cache`);
      }
    });
  }
}

module.exports = { redisCache, cacheControl };