const mongoose = require('mongoose')
const config = require('./config')
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.mongostring || config.database)
        console.log('Database Connected')
    }

    catch(error){
        console.log(`Database failed to connect due to ${error}`)
    }
}

module.exports = connectDB;