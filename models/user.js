const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    country:{type:String,required:true},
    state:{type:String,required:true},
    phNumber:{type:Number,required:true},
    isActive:{type:Boolean,default:false,required:true}
})

module.exports = mongoose.model('User',userSchema);