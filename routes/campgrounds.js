
let express = require('express');
let router = express.Router();
let Camp = require('../models/camp');
let middleware = require('../middleware');
let geocoder = require('geocoder');

//Get all campgrounds
router.get('/', function(req, res){
    Camp.find({}, function(error, campgrounds){
        if(error || !campgrounds){
            console.log("Error---> " + error);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }else{            
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
});

//Display form to add new campground
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//Add new campground to db
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var cost = req.body.cost;
   
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = 0,
        lng = 0,
        location = "";

        //var lat = 37.4224764, 
        //    lng = -122.0842499, 
        //    location = "1600 Amphitheatre Parkway, Mountain View, CA 94043, USA"; 

        if(data && data.results && data.results.length){
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;              
        }

        var newCampground = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
      // Create a new campground and save to DB
        Camp.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
                req.flash("error", "Creating campground was unsuccessful");
                res.redirect("/campgrounds");
            } else {    
                req.flash("success", "Campground successfully created");
                res.redirect("/campgrounds");
            }
      });
    });
  });

//Show details on one campground
router.get("/:id", function(req, res){      
    Camp.findById(req.params.id).populate("comments").exec(function(error, camp){
        if(error || !camp){
            console.log("Error----> " + error);
            req.flash("error", "Campground not found");
            res.redirect('back');
        }else{      
            let google_api_url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.API_KEY + "&callback=initMap";      
            res.render("campgrounds/show", {camp: camp, google_api_url: google_api_url});
        }
    });
});

//Edit camp form
router.get('/:id/edit', middleware.checkCampOwnership, function(req, res){
    Camp.findById(req.params.id, function(err, foundCamp){           
        //If the logged in user is the author of campground  
        if(err || !foundCamp)          {
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }else{
            res.render('campgrounds/edit', {camp: foundCamp});            
        }        
    });
});

//Update camp
router.put("/:id", middleware.checkCampOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = 0,
            lng = 0,
            location = "";
       
        if(data && data.results && data.results.length){
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            location = data.results[0].formatted_address;               
        }
     
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
        Camp.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
            if(err || !campground){
                console.log("Error----> " + err);
                req.flash("error", "Campground not found");
                res.redirect('back');
            }else{
                req.flash("success", "Successfully updated camp");
                res.redirect('/campgrounds/' + req.params.id);
            }
      });
    });
  });

//delete-destroy camp
router.delete('/:id', middleware.checkCampOwnership, function(req, res){
    Camp.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("Error---> " + err);
            req.flash("error", "Deleting campground was unsuccessful");
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;