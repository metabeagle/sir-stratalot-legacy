// const url           = require('url'),
//       keys          = require('../config/keys'),
//       cache         = require('express-redis-cache')({
//         client: require('redis').createClient(keys.redisCacheUrl, { no_ready_check: true }),
//         prefix: keys.cachePrefix
//       });

// cache.on("connect", function (err) {
//     if(err) {
//       console.log('error: ' + err);
//     } else {
//       console.log('connected to redis cache')
//     }
// });
// cache.on("error", function (err) {
//     console.log("error " + err);
// });

// cache.on("message", function(message) {
//   console.log("cache", message);
// });

// cacheMiddleware = {
//   cacheRoute: (expire) => {
//     return cache.route({ expire: expire });
//   },
//   cacheDelete: (names) => {
//     return (req, res, next) => {
//       if(names === undefined){
//         names = [res.locals.url];
//       }
//       names.forEach(function(name){
//         cache.del(name, function(err, num){
//           if(err){
//             next(err);
//           }
//         });
//       });
//       next();
//     }
//   },
//   cacheDeleteReferer: () => {
//     return (req, res, next) => {
//       let name = url.parse(res.locals.referer).pathname;
//       cache.del(name, function(err, num){
//         if(err){
//           next(err);
//         }
//       });
//       next();
//     }
//   }
// }

// module.exports = cacheMiddleware;