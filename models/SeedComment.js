var mongoose=require("mongoose");

var Comment= new mongoose.Schema({
	text:String,
	createdAt:{
		type:Date,default:Date.now
	
	},
	author:{
		id:{
		type: mongoose.Schema.Types.ObjectId,
		ref:"User"
	
	},
	username:String
	}
     
})

module.exports=mongoose.model("comments",Comment);