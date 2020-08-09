var mongoose=require("mongoose");
var Campgrounds=require("./models/SeedCampground");
var Comments=require("./models/SeedComment");

var data=[
	{
	        name:"vamc",
 	       image:"https://cdn.spacetelescope.org/archives/images/wallpaper2/heic2007a.jpg",
	        description:"good character and nice place to roam..."
    },
	{
	        name:"Sai",
 	       image:"https://cdn.spacetelescope.org/archives/images/wallpaper2/heic2007a.jpg",
	        description:"good character and nice place to roam..."
    },
	{
	        name:"Nandhu",
 	       image:"https://cdn.spacetelescope.org/archives/images/wallpaper2/heic2007a.jpg",
	        description:"good character and nice place to roam..."
    }
    		 
		 
		 
 ]

function SeedDB(){
	// Campgrounds.remove({},function(err){
	// 	if(err)
	// 		console.log(err);
	// 	else{
	// 		console.log("Removes campgrounds successfully");
	// 			data.forEach(function(seed){
	// 				Campgrounds.create(seed,function(err,data){
	// 					if(err)
	// 						console.log(err);
	// 					else{
	// 						console.log("Campgrounds added");
	// 						Comments.create({
	// 							text:"hello there nice camp",
	// 							author:"Sai"
	// 						}, function(err,comments){
	// 							if(err)
	// 								console.log(err);
	// 							else{
	// 								data.comment.push(comments);
	// 								data.save();
	// 								console.log("Created comment");
	// 							}
	// 						})
	// 					}
	// 				})
	//             })
	// 	}
			
		
	// });

	
}

module.exports=SeedDB;