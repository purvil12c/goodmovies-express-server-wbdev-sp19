module.exports = (app) => {
    const reviews = require('../controllers/review.controller.js');

    app.post('/reviews', reviews.create);

    app.get('/reviews', reviews.findByQuery);

    app.put('/reviews/:reviewId', reviews.update);

    app.delete('/reviews/:reviewId', reviews.delete);

}
