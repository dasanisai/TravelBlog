var express=requires("express");
var app=express();

var Campgrounds=require("../models/SeedCampground");

var Comments=require("../models/SeedComment");
app.get("/Camp/:id/comments/new",isLoggedIn,function(req,res){
	Campgrounds.findById(req.params.id,function(err,comment){
		if(err)
			console.log(err);
		else{
			
            	res.render("/comments/new.ejs",{comment:comment});    
		}
	});
});

app.post("/Camp/:id/comments",isLoggedIn,function(req,res){
	Campgrounds.findById(req.params.id,function(err,campcomment){
		if(err)
			console.log(err)
		
		else{
			Comments.create(req.body.comments,function(err,comments){
				if(err){
					console.log(err);
				}
				else{
					campcomment.comment.push(comments);
					campcomment.save();
					res.redirect("/Camp/"+campcomment._id);
				
				}
			})
		}
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
};
module.exports=app;
