const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    products:[{productID:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
               stockStatus:{type:String,required:true}, cost:{type:Number}}],
})

module.exports = mongoose.model('Wishlist',wishlistSchema);