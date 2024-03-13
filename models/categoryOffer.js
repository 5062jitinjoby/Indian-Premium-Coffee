const mongoose = require('mongoose');

const categoryOfferSchema = new mongoose.Schema({
    category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
    offer:{type:Number,required:true},
})

module.exports = mongoose.model('CategoryOffer',categoryOfferSchema);