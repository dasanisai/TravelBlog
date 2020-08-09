var mongoose=require("mongoose");
//var Comments=require("./SeedComment");


var yelpSchema=new mongoose.Schema({
	name:String,
	image:String,
	description:String,
	createdAt:{
		type:Date,default:Date.now
	
	},
	author:{
		
			id:{
		        type: mongoose.Schema.Types.ObjectId,
		       ref:"User"
	
	       },
	        username:String
		},
	
	comment:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"comments"
	}]
});

module.exports=mongoose.model("mongoose",yelpSchema)