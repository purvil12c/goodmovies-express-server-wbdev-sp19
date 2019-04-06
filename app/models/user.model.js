const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
  username: {type: String, lowercase: true, required: [true, "can't be blank"], unique: true, match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  password: {type: String, required: [true, "can't be blank"]},
  email: {type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  type: {type: String, required: [true, "can't be blank"]},
  ratings: [{movieId: {type: String}, rating: {type: Number}}],
  reviews: [{reviewId: {type: 'ObjectId'}}],
  watchlist: [{movieId: {type: String}}],
  followers: [{userId: {type: 'ObjectId'}}],
  following: [{userId: {type: 'ObjectId'}}]
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);
