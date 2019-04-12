const User = require('../models/user.model.js');

exports.follow = (req, res) => {
  let userId = req.params.userId;
  let followId = req.params.followId;

  let username = req.body.username;

  User.findById(userId)
    .then(user=>{

      user.following.push({userId: followId, username: username});
      return user.save();
    })
    .then(()=>User.findById(followId))
    .then(user2=>{
      user2.followers.push({userId: userId, username: username});
      return user2.save();
    })
    .then(()=>res.status(200).send({message: "Followed Successfully"}))
    .catch(err=>res.status(500).send({message: err.message}));

}

exports.unfollow = (req, res) => {
  let userId = req.params.userId;
  let followId = req.params.followId;

  User.findById(userId)
    .then(user=>{
      let i = 0;
      for(i = 0;i<user.following.length;i++){
        if(user.following[i].userId==followId){
          break;
        }
      }
      user.following.pull({_id: user.following[i]._id, userId: followId});
      return user.save();
    })
    .then(()=>User.findById(followId))
    .then(user2=>{
      let i = 0;
      for(i = 0;i<user2.followers.length;i++){
        if(user2.followers[i].userId==userId){
          break;
        }
      }
      user2.followers.pull({userId: userId, _id: user2.followers[i]._id});
      return user2.save();
    })
    .then(()=>res.status(200).send({message: "Unfollowed Successfully"}))
    .catch(err=>res.status(500).send({message: err.message}));
}
