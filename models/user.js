let mongoose = require('mongoose');
let passportLocalMongoose = require('passport-local-mongoose');

let userSchema = new mongoose.Schema({
    username: String,
    password: String
},
{
	timestamps: true,
});

let options = {
    errorMessages: {
     IncorrectPasswordError: 'Password is incorrect',
     IncorrectUsernameError: 'Username is incorrect'
    }
};

userSchema.plugin(passportLocalMongoose, options);

module.exports = mongoose.model("User", userSchema);