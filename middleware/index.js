
let middlewareObj = {};
let Camp = require('../models/camp');
let Comment = require('../models/comment');

middlewareObj.checkCampOwnership = function (req, res, next){
    //Check if the user is logged in
    if(req.isAuthenticated()){
        Camp.findById(req.params.id, function(err, foundCamp){
            if(err || !foundCamp){
                console.log("error----> " + err);
                req.flash("error", "Campground not found");
                res.redirect('back');
            }else{
                //If the logged in user is the author of campground
                if(foundCamp.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You need be the owner to perform this operation")
                    res.redirect('back');
                }                
            }
        });
    }else{  
        req.flash("error", "You need to be logged in");
        res.redirect('back');              
    }  
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    //Check if the user is logged in
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err || !foundComment){
                console.log("error----> " + err);
                req.flash("error", "Comment not found");
                res.redirect('back');
            }else{
                //If the logged in user is the author of campground
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You need be the owner to perform this operation")
                    res.redirect('back');
                }                
            }
        });
    }else{  
        req.flash("error", "You need to be logged in");
        res.redirect('back');              
    }  
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect('/login');
}

module.exports = middlewareObj;