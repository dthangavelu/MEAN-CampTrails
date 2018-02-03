let express = require('express'),
    app = express(),
    request  = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    Camp = require('./models/camp'),
    User = require('./models/user'),
    Comment = require('./models/comment');

let indexRoutes = require('./routes/index'),
    commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds');

require('dotenv').config()

app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(flash());

mongoose.connect("mongodb://localhost/camptrailsdb");
mongoose.Promise = global.Promise;

app.use(methodOverride('_method'));

app.use(require('express-session')({
    secret: "Camping is fun",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');

//Passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(8000, function(){
    console.log("Server started on port 8000...");
});