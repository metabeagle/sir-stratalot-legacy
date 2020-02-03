const url = require('url');

skipMiddleware = {
  skipQuery: (req, res, next) => {
  	if(Object.keys(req.query).length !== 0){
  		res.redirect(req.path);
  	}
  	next();
  }
  // skipCache: (req, res, next) => {
  // 	res.use_express_redis_cache = !req.isAuthenticated();
  // }
}

module.exports = skipMiddleware;