const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    orders:[{products:[{productID:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
                quantity:{type:Number},cost:{type:Number}}],date:{type:Date,required:true},status:{type:String}}]
})

module.exports = mongoose.model('Orders',orderSchema);