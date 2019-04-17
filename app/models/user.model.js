const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
  username: {type: String, lowercase: true, required: [true, "can't be blank"], unique: true, match: [/^[a-zA-Z0-9]+$/, 'is invalid'], index: true},
  password: {type: String, required: [true, "can't be blank"]},
  firstname: {type: String},
  lastname: {type: String},
  email: {type: String, lowercase: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  type: {type: String, required: [true, "can't be blank"]},
  ratings: [{movieId: {type: String}, rating: {type: Number}}],
  reviews: [{reviewId: {type: 'ObjectId', required: true}, username: {type: String, required: true}}],
  watchlist: [{movieId: {type: String, required: true}, movieName: {type: String, required: true}, imageUrl: {type: String}}],
  followers: [{userId: {type: 'ObjectId', required: true}, username: {type: String, required: true}}],
  following: [{userId: {type: 'ObjectId', required: true}, username: {type: String, required: true}}]
});

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

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
