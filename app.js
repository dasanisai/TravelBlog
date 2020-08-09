var express=require("express");
var app=express();
var body=require("body-parser");
var mongoose =require("mongoose"),
	User=require("./models/user"),
	passport=require("passport"),
	flash=require("connect-flash"),
	passportlocal=require("passport-local"),
	passportmongoose=require("passport-local-mongoose"),
	methodOverride=require("method-override");
var dotenv=require("dotenv");
dotenv.config();
//mongodb://localhost:27017/yelp_camp
//mongodb+srv://dasanisai:bobby@123@cluster0-rmnaj.mongodb.net/<dbname>?retryWrites=true&w=majority

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://dasanisai:bobby@123@cluster0-rmnaj.mongodb.net/TravelBlog?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("TravelBlog").collection("travelling");
//   // perform actions on the collection object
//   client.close();
// });

mongoose.connect(process.env.MONGODB_URI|| "mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true,useUnifiedTopology:true});
var Campgrounds=require("./models/SeedCampground");
var Comments=require("./models/SeedComment");


var SeedDB=require("./seed");
SeedDB();

// var commentroutes=("./routes/comments"),
// 	campgroundroutes=("./routes/campground"),
// 	indexroutes=("./routes/index");

app.use(methodOverride("_method"))
app.use(body.urlencoded({"extended":true}));
app.use(express.static(__dirname+"/public"));
//console.log(__dirname+"/public");
app.use(require("express-session")({
	secret:"sai pavan jntuhceh",
	resave:false,
	saveUninitialized:false
}));

app.use(flash());
app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportlocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    	res.locals.currentUser=req.user;
	    res.locals.error=req.flash("error");
	    res.locals.success=req.flash("success")
		next();
});


// app.use(indexroutes);

// app.use(campgroundroutes);

// app.use(commentroutes);
app.get("/",function(req,res){
	
	res.render("home.ejs");
	
})

app.get("/Camp",async function(req,res){
	//console.log(req.user);
	await Campgrounds.find({},function(err,allcamps){
		if(err)
			console.log(err);
		else
			
	      res.render("campgrounds/campground.ejs",{camp:allcamps,currentUser:req.user });
			
	})
	
});
app.post("/postcamp",isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	
	var desc=req.body.description;
	var author={
      
		id:req.user._id,
		username:req.user.username
		
	};
	var newc={name:name,image:image,description:desc,author:author};
	Campgrounds.create(newc,function(err,newcamp){
		
		if(err)
			console.log(err);
		else
			
	         res.redirect("/Camp");
	     
	})
	
	
	//res.send("postcamp");
});
app.get("/Camp/new",isLoggedIn,function(req,res){
	
	res.render("campgrounds/newcamp.ejs");
	
}) 
app.get("/Camp/:id",function(req,res){
	
	Campgrounds.findById(req.params.id).populate("comment").exec(function(err,foundcampgroud){
		if(err){
			console.log(err);
		}
		else{
			
		res.render("campgrounds/show.ejs",{camp:foundcampgroud});
		}
		
	});
	
});

app.get("/Camp/:id/comments/new",isLoggedIn,function(req,res){
	Campgrounds.findById(req.params.id,function(err,comment){
		if(err)
			console.log(err);
		else{
			
            	res.render("comments/new.ejs",{comment:comment});    
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
					comments.author.id=req.user._id;
					comments.author.username=req.user.username;
					comments.save();
					
					campcomment.comment.push(comments);
					campcomment.save();
					res.redirect("/Camp/"+campcomment._id);
				
				}
			})
		}
	})
});
//comment section


//authentication
app.get("/register",function(req,res){
	res.render("register.ejs");
});
  
app.post("/register", function(req,res){
	var newUser = new User({
		username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
	});
	if(req.body.admincode === 'secretcode123') {
      newUser.isAdmin = true;
    }
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			req.flash("error",err.message);
			return res.redirect("/register");
		}
		
		passport.authenticate("local")(req,res,function(){
			req.flash("success","Successfully logged in as "+user.username);
			res.redirect("/Camp");
		})
	})
});

//login
app.get("/userlogin", function(req,res){
	res.render("login.ejs");
})

app.post("/userlogin", passport.authenticate("local",{
	successRedirect:"/Camp",
	failureRedirect:"/userlogin"
	
}),function(req,res){
	req.flash("success","Successfully logged in as "+user.username);
});

//logout
app.get("/logout",function(req,res){
	//res.send("Ok loggin out");
	 req.logout();
	req.flash("success","logged you out");
	 res.redirect("/Camp");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	
	req.flash("error","login first");
	res.redirect("/userlogin");
};

//update posts

app.get("/Camp/:id/edit",checkownership,function(req,res){
	
	Campgrounds.findById(req.params.id,function(err,foundcampground){
		if(err)
			res.send(err);
		else{
			res.render("campgrounds/edit.ejs",{foundcampground:foundcampground});
		}
		
	})
});

app.put("/Camp/:id",checkownership,function(req,res){
	Campgrounds.findByIdAndUpdate(req.params.id,req.body.camp,function(err,updated){
		
		if(err)
		res.send(err);
	    else{
		res.redirect("/Camp/"+req.params.id);
	     }
	})
	
});

app.delete("/Camp/:id",checkownership,function(req,res){
	Campgrounds.findByIdAndRemove(req.params.id,function(err,deleted){
		if(err)
			res.send(err);
		else{
			res.redirect("/Camp");
		}
	})
});

function checkownership(req,res,next){
	
	if(req.isAuthenticated()){
		Campgrounds.findById(req.params.id,function(err,foundcampground){
			
			if(err)
				res.redirect("back");
			else{
				
				if(foundcampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				}
				else{
					//res.send("You Dont have permission!!!");
					res.redirect("back");
				}
			}
		});
		
	}
	else{
			res.redirect("back");
		}
}

//comments edit
app.get("/Camp/:id/comments/:comments_id/edit",checkcommentownership,function(req,res){
	Comments.findById(req.params.comments_id,function(err,editcomment){
		if(err)
			res.send(err);
		else{
			res.render("comments/edit.ejs",{editcomment:editcomment,campground_id:req.params.id});
		}
	})
	
});

app.put("/Camp/:id/comments/:comments_id",checkcommentownership, function(req,res){
	Comments.findByIdAndUpdate(req.params.comments_id,req.body.comments,function(err,foundcomment){
		if(err)
			res.redirect("back");
		else{
			req.flash("success","comment added");
			res.redirect("/Camp/"+req.params.id);
		}
	})
	
	
});

//comment delete

app.delete("/Camp/:id/comments/:comments_id", checkcommentownership,function(req,res){
	Comments.findByIdAndRemove(req.params.comments_id,function(err){
		if(err)
			res.send(err);
		else
			{
			  req.flash("success","comment deleted");
			  res.redirect("/Camp/"+req.params.id);
			}
			
	})
	
});

//comment auth

function checkcommentownership(req,res,next){
	
	if(req.isAuthenticated()){
		Comments.findById(req.params.comments_id,function(err,foundcampground){
			
			if(err)
				res.redirect("back");
			else{
				
				if(foundcampground.author.id.equals(req.user._id) || req.user.isAdmin){
                   next();
               }
				else{
					//res.send("You Dont have permission!!!");
					res.redirect("back");
				}
			}
		});
		
	}
	else{
			res.redirect("back");
		}
};

//User's profile

app.get("/users/:id",function(req,res){
	
	User.findById(req.params.id,function(err,founduser){
		if(err)
			res.send(err);
		else{
			Campgrounds.find().where('author.id').equals(founduser._id).exec(function(err, campgrounds) {
				  if(err) {
					req.flash("error", "Something went wrong.");
					res.redirect("/");
				  }
				  res.render("users.ejs", {founduser: founduser, campgrounds: campgrounds});
				})
		   }
	})
})
app.listen(process.env.PORT,process.env.IP,function(){
	
	console.log("YelpCamp  listening");
});