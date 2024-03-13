const mongoose = require('mongoose');

const productOfferSchema = new mongoose.Schema({
    product:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
    offer:{type:Number,required:true},
})

module.exports = mongoose.model('ProductOffer',productOfferSchema);