var express=requires("express");
var app=express();
var User=require("../models/user"),
	passport=require("passport");
	

app.get("/",function(req,res){
	
	res.render("home.ejs");
	
})

 
//comment section


//authentication
app.get("/register",function(req,res){
	res.render("/register.ejs");
});

app.post("/register", function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username:req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/Camp");
		})
	})
});

//login
app.get("/login", function(req,res){
	res.render("/login.ejs");
})

app.post("/login", passport.authenticate("local",{
	successRedirect:"/Camp",
	failureRedirect:"/login"
	
}),function(req,res){
	
});

//logout
app.get("/logout",function(req,res){
	//res.send("Ok loggin out");
	 req.logout();
	 res.redirect("/Camp");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	res.redirect("/login");
};

module.exports=app;

