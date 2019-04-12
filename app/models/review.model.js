const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  movieId: {type: String, required: true},
  movieName: {type: String},
  username: {type: String, required: true},
  userId: {type: 'ObjectId', required: true},
  title: {type: String, required: true},
  body: {type: String, required: true}
});

module.exports = mongoose.model('Review', ReviewSchema);
