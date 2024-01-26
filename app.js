const express = require('express')
const path =require("path")
const session = require('express-session')
const nocache = require('nocache')

const connectDB = require('./db')
const config = require('./config')

const app = express();
connectDB();


app.use('/public',express.static(path.join(__dirname,"/public")));
app.use('/uploads',express.static(path.join(__dirname,"/uploads")))
const userRoute = require('./routers/userRoute')
const adminRoute = require('./routers/adminRoute')

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:config.secret,
    resave:true,
    saveUninitialized:false}))

app.use(nocache())

app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(5000,()=>{
    console.log('Server is listening on port 5000')
})