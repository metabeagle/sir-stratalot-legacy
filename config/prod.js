module.exports = {
  mongoURI: process.env.MONGODB_URI,
  twitterConsumerKey: process.env.TWITTER_CONSUMER_KEY,
  twitterConsumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN,
  twitterAccessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  callbackURL: 'https://www.sirstratalot.com/auth/twitter/callback',
  cookieKey: process.env.COOKIE_KEY,
  redisStoreUrl: process.env.REDISCLOUD_STORE,
  redisCacheUrl: process.env.REDISCLOUD_URL,
  cachePrefix: 'sirstratalot'
};