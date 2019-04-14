const User = require('../models/user.model.js');

exports.create = (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    type: req.body.type,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  })
  user.save()
    .then(user=>{
      req.session['currentUser'] = user;
      res.send(user);
    })
    .catch(err=>{
      res.status(500).send({
            message: err.message || "Some error occurred while creating the User."
      });
    })
};

exports.findAll = (req, res) => {
  User.find()
      .then(users => {
          res.send(users);
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while retrieving users."
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

exports.login = (req, res) => {
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
            req.session['currentUser'] = user;
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

exports.profile = (req, res) => {
  if(req.session['currentUser']!=undefined){
    User.findById(req.session['currentUser']._id)
      .then(user=>{
        console.log(user)
        res.status(200).send(user);
      })
      .catch(err => {
        console.log(err)
        res.status(500).send({err: err.message});
      })
  }
  else{
    res.status(404).send({message: 'You are not logged in'});
  }
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
  User.findOneAndUpdate({_id: req.params.userId}, req.body, function(err, user){
    if(err){
      return res.status(500).send({message: 'error occured while updating'});
    }
    if(!user){
      return res.status(404).send({message: 'user not found'});
    }
    return res.status(200).send(req.body);
  });
};

exports.delete = (req, res) => {
  User.deleteOne({ _id: req.params.userId }, function (err) {
    if (err){
      return res.status(500).send({message: 'error occurred while deleting'});
    }
    res.status(200).send({message: 'Successfully deleted'});
  });
};

exports.searchByUsername = (req, res) => {
  User.find({ username: {'$regex': req.params.username, '$options': 'i'}})
    .then(users=>{
      res.status(200).send(users);
    })
    .catch(err=>{
      res.status(500).send({message: err.message | "Error occured"});
    })
}
