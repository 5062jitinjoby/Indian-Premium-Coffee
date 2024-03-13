const express = require('express')
const path =require("path")
const session = require('express-session')
const nocache = require('nocache')
const methodOverride = require('method-override')
require('dotenv').config()

const port=process.env.PORT

const connectDB = require('./db')
const config = require('./config')

const app = express();
connectDB();

app.set('view engine', 'ejs')
app.use('/public',express.static(path.join(__dirname,"/public")));
app.use('/uploads',express.static(path.join(__dirname,"/uploads")));
app.use(methodOverride('_method'));
const userRoute = require('./routers/userRoute')
const adminRoute = require('./routers/adminRoute')

//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:config.secret,
    resave:true,
    saveUninitialized:false}))

app.use(nocache())

app.use('/',userRoute)

app.use('/admin',adminRoute)

app.get("*", (req, res) => {
    // console.log('404 page');
    res.status(404).render('404', (err, html) => {
        if (err) {
            console.error('Error rendering 404 page:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(html);
        }
    });
});


app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`)
})