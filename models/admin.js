const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminID:{type:String,required:true},
    password:{type:String,required:true}
})

module.exports = mongoose.model('Admin',adminSchema);