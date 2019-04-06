const User = require('../models/user.model.js');

exports.create = (req, res) => {
  const user = new User({
        username: req.body.username,
        password: req.body.password,
        type: req.body.type
  });
  user.save()
    .then(data=>{
      req.session['currentUser'] = user;
      res.send(data);
    })
    .catch(err=>{
      res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
      });
    })
};

exports.findAll = (req, res) => {
  User.find()
      .then(users => {
          res.send(users);
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while retrieving notes."
          });
      });
};

exports.findOne = (req, res) => {
  User.findById(req.params.userId)
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        res.send(user);
    }).catch(err => {
        return res.status(500).send({
            message: "Error retrieving user with id " + req.params.userId
        });
    });
};

exports.findUserByCredentials = (req, res) => {
  User.findOne({username: req.body.username})
    .then(user=>{
      if(!user){
        res.status(404),send({
          message: "User not found"
        })
      }

      user.comparePassword(req.body.password, function(err, isMatch) {
          if (err) {
            return res.status(500).send({
              message: "Error occurred: "+err.message
            })
          }
          if(isMatch){
            return res.status(200).send(user);
          }
          res.status(404).send({message: 'Password is incorrect'});
      });

    })
    .catch(err => {
        return res.status(500).send({
            message: "Error retrieving user with username " + req.body.username
        });
    });
}

exports.logout = (req, res) => {
  req.session.destroy(function(err){
    if(err){
      res.status(500).send({message: 'unable to destroy session'});
    }
    else{
      res.status(200).send({message: 'Successfully logged out'});
    }
  })
}

exports.update = (req, res) => {

};

exports.delete = (req, res) => {
  User.deleteOne({ _id: req.params.userId }, function (err) {
    if (err){
      return res.status(500).send({message: 'error occurred while deleting'});
    }
    res.status(200).send({message: 'Successfully deleted'});
  });
};
