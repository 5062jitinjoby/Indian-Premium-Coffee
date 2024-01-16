const express = require('express')
const session = require('express-session')
const nocache = require('nocache')

const connectDB = require('./db')
const config = require('./config')

app = express();
connectDB();

app.set('view engine','ejs')

const userRoute = require('./routers/userRoute')
const adminRoute = require('./routers/adminRoute')

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:config.secret,
    resave:true,
    saveUninitialized:true}))

app.use(nocache())

app.use('/',userRoute)
app.use('/admin',adminRoute)

app.listen(5000,()=>{
    console.log('Server is listening on port 5000')
})