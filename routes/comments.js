
let express = require('express');
let router = express.Router({mergeParams: true});
let Camp = require('../models/camp');
let Comment = require('../models/comment');
let middleware = require('../middleware');

//New comments form
router.get('/new', middleware.isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(error, camp){
        if(error || !camp){
            console.log("Error----> " + error);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        }else{            
            res.render("comments/new", {campground: camp});
        }
    });    
});

//Add new comments
router.post('/', middleware.isLoggedIn, function(req, res){
    Camp.findById(req.params.id, function(error, camp){
        if(error || !camp){
            console.log("Error----> " + error);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");            
        }else{             
            Comment.create(req.body, function(error, newcomment){
                if(error){
                    console.log("error---> " + error);
                    req.flash("error", "Something went wrong");
                    res.redirect("/campgrounds");
                }else{    
                    newcomment.author.id = req.user._id;
                    newcomment.author.username = req.user.username; 
                    newcomment.save();              
                    camp.comments.push(newcomment);
                    camp.save();                    
                    req.flash("success", "Successfully added comments");
                    res.redirect('/campgrounds/' + camp._id);
                }
            });
        }
    });   
});

//Edit comment form
router.get('/:commentId/edit', middleware.checkCommentOwnership, function(req, res){
    Camp.findById(req.params.id, function(err, foundCamp){
        if(err || !foundCamp){
            console.log("Err---> " + err);
            req.flash("error", "Campground not found");
            return res.redirect("/campgrounds");
        }
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err || !foundComment){
                console.log("err---> " + err);
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            }else{
                res.render("comments/edit", {camp_id: req.params.id, comment: foundComment});
            }
        }); 
    });       
});

//Update comment
router.put('/:commentId', middleware.checkCommentOwnership, function(req, res){
    Camp.findById(req.params.id, function(req, res){
        if(err){
            console.log("Err---> " + err);
            req.flash("error", "Campground not found");
            return res.redirect("/campgrounds");
        }
        Comment.findByIdAndUpdate(req.params.commentId, req.body, function(err){
            if(err){
                console.log("Err---> " + err);
                req.flash("error", "Campground update unsuccessful");            
                res.redirect('/campgrounds');
            }else{
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });    
});

//delete-destroy comment
router.delete("/:commentId", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("Err---> " + err);
            req.flash("error", "Delete comment was unsuccessful");            
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Comments deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
