var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: '0Fu7kXnNzokkDcQUFiDHsvvLo',
  consumer_secret: 'uijR6YncpTGX9nnRZeIZijLvUhyxkDglIU1Xxq7cQemHjohOsf',
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAKS79wAAAAAAoOEVPmgPLeKR99WiVRMabqVSQVk%3Dp1DfQIL7xhRt6gGMod8EQux7b986YERjrFvWRzkvKURHSZ2vs1'
});


exports.searchTweetsByMovie = (req, res) =>
  client.get('search/tweets', {q: req.params.movieName, lang: 'en', result_type: 'popular'})
    .then(tweets=>res.send(tweets));
