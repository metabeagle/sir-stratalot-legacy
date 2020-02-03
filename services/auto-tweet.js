const Twitter = require('twitter'),
      keys    = require('../config/keys');

function newClient(subdomain = 'api') {
  return new Twitter({
    subdomain,
    consumer_key: keys.twitterConsumerKey,
    consumer_secret: keys.twitterConsumerSecret,
    access_token_key: keys.twitterAccessToken,
    access_token_secret: keys.twitterAccessTokenSecret,
  });
}

async function sendTweet(subkind, title, makers, url) => {
  let client = newClient();
  const response = await client.post('statuses/update', {
    status: `Added ${title} by ${makers}. ${url}`
  });
}