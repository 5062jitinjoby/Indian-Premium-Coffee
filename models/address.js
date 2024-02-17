const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    addresses:[{Name:{type:String,required:true},
                Mobile:{type:Number},
                Pincode:{type:Number},
                Locality:{type:String},
                Address:{type:String},
                City:{type:String},
                State:{type:String},
                Country:{type:String}}]
})  

module.exports = mongoose.model('Address',addressSchema);