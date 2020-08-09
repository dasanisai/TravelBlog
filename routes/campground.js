var express=requires("express");
var app=express();
var Campgrounds=require("../models/SeedCampground");


app.get("/Camp",function(req,res){
	//console.log(req.user);
	Campgrounds.find({},function(err,allcamps){
		if(err)
			console.log(err);
		else
			
	      res.render("/campgrounds/campground.ejs",{camp:allcamps,currentUser:req.user });
			
	})
	
});
app.post("/postcamp",function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	
	var desc=req.body.description;
	var newc={name:name,image:image,description:desc};
	Campgrounds.create(newc,function(err,newcamp){
		
		if(err)
			console.log(err);
		else
			
	         res.redirect("/Camp");
	     
	})
	
	
	//res.send("postcamp");
});
app.get("/Camp/new",function(req,res){
	
	res.render("/campgrounds/newcamp.ejs");
	
}) 
app.get("/Camp/:id",function(req,res){
	
	Campgrounds.findById(req.params.id).populate("comment").exec(function(err,foundcampgroud){
		if(err){
			console.log(err);
		}
		else{
			
		res.render("/campgrounds/show.ejs",{camp:foundcampgroud});
		}
		
	});
	
});

module.exports=app;
