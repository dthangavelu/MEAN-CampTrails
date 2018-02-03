
let express = require('express');
let router = express.Router();
let passport = require('passport');
let User = require('../models/user');

//Landing Page
router.get('/', function(req, res){
    res.render('landing');
});

//Register form
router.get('/register', function(req, res){
    res.render('register');
});

//Create new registration
router.post('/register', function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log("Err----> " + err);            
            return res.render('register', {"error": err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to CampTrails " + user.username);
            res.redirect('/campgrounds');
        });
    });
});

//Login form
router.get('/login', function(req, res){
    res.render('login');
});

//Let the user login
router.post('/login', passport.authenticate("local", {
successRedirect: "/campgrounds",
failureRedirect: "/login",
failureFlash: true,
successFlash: true
}),function(req, res){    
});

//Lets the user logout
router.get('/logout', function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

/* //catch all other routes
router.get('*', function(req, res){
    res.send("Page not found");
}); */

module.exports = router;