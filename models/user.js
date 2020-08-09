var mongoose=require("mongoose"),
    passportlocal=require("passport-local-mongoose");

var User=new mongoose.Schema({
	username:String,
	passward:String,
	avatar: String,
    firstName: String,
    lastName: String,
    email: String,
	isAdmin:{type:Boolean,default:false}

});

User.plugin(passportlocal);
module.exports=mongoose.model("user",User);
