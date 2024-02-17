const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userID:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    products:[{productID:{type:mongoose.Schema.Types.ObjectId,ref:'Product'},
                quantity:{type:Number},cost:{type:Number}}],
    billTotal:{type:Number}
})

module.exports = mongoose.model('Cart',cartSchema);