module.exports = (app) => {
    const users = require('../controllers/user.controller.js');
    const follow = require('../controllers/follow.controller.js');
    const watchlist = require('../controllers/watchlist.controller.js');
    const review = require('../controllers/review.controller.js');
    const twitter = require('../controllers/twitter.controller.js')

    app.post('/users/login', users.login);

    app.post('/users/signup', users.create);

    app.get('/users/profile', users.profile);

    app.post('/users/logout', users.logout);

    app.get('/users', users.findAll);

    app.get('/users/:userId', users.findOne);

    app.put('/users/:userId', users.update);

    app.delete('/users/:userId', users.delete);

    app.post('/users/:userId/follow/:followId', follow.follow);

    app.post('/users/:userId/unfollow/:followId', follow.unfollow);

    app.post('/users/:userId/watchlist/:movieId', watchlist.addToWatchlist);

    app.post('/users/:userId/unwatchlist/:movieId', watchlist.removeFromWatchlist);

    app.get('/users/:userId/reviews', review.findReviewsByUserId);

    app.get('/users/search/:username', users.searchByUsername);

    app.get('/twitter/:movieName', twitter.searchTweetsByMovie);

}
