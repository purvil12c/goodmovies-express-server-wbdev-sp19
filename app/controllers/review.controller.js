const Review = require('../models/review.model.js');
const User = require('../models/user.model.js');

exports.create = (req, res) => {
  const review = new Review({
        username: req.body.username,
        movieName: req.body.movieName,
        title: req.body.title,
        userId: req.body.userId,
        movieId: req.body.movieId,
        body: req.body.body
  });
  review.save()
    .then(review=>{
      User.findById(req.body.userId)
        .then(user=>{
          user.reviews.push({reviewId: review._id, username: user.username});
          user.save()
            .then(user=>{
              res.send(review);
            })
        })
        .catch(err=>res.status(500).send({message: err.message}))
    })
    .catch(err=>{
      res.status(500).send({
            message: err.message || "Some error occurred while adding the review."
      });
    })
};

exports.update = (req, res) => {
  Review.findOneAndUpdate({_id: req.params.reviewId}, req.body, function(err, review){
    if(err){
      return res.status(500).send({message: 'error occured while updating'});
    }
    if(!review){
      return res.status(404).send({message: 'review not found'});
    }
    return res.status(200).send(review);
  });
};

exports.delete = (req, res) => {
  Review.deleteOne({ _id: req.params.reviewId }, function (err) {
    if (err){
      return res.status(500).send({message: 'error occurred while deleting'});
    }
    res.status(200).send({message: 'Successfully deleted'});
  });
};

exports.findByMovieId = (req, res) => {
  Review.find({movieId: req.params.movieId})
    .then(reviews => {
        res.send(reviews);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving reviews."
        });
    });
}

exports.findByReviewId = (req, res) => {
  Review.findById(req.params.reviewId)
    .then(review => {
        res.send(review);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving reviews."
        });
    });
}

exports.findReviewsByUserId = (req, res) => {
  Review.find({userId: req.params.userId})
    .then(reviews => {
      res.status(200).send(reviews);
    })
    .catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving reviews."
      });
    })
}

exports.findByQuery = (req, res) => {
  let query = {
  }
  if(req.query.reviewId!=undefined){
    query._id = req.query.reviewId;
  }
  if(req.query.movieId!=undefined){
    query.movieId = req.query.movieId;
  }

  Review.find(query)
    .then(reviews => {
      res.send(reviews);
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving reviews."
        });
    });
}
