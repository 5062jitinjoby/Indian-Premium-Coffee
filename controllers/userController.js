const User = require('../models/user')

const userController ={
    //login
    getL:(req,res)=>{
        res.redirect('/login')
    },
    getLogin:(req,res)=>{
        res.render('login')
    },
    postLogin:async (req,res)=>{
        try{
            const userData = await User.findOne({email:req.body.email})
            if(userData.password === req.body.password){
                res.send('Success')
            }
            else{
                res.send('Wrong password')
            }
        }
        catch{
            res.send('Invalid Credentials')
        }   
    },

    //signUp
    getsignup:(req,res)=>{
        res.render('signup')
    },
    postsignup:async (req,res)=>{
        const data = {
            username:req.body.username,
            email:req.body.email,
            country:req.body.country,
            state:req.body.state,
            pincode:req.body.pincode
        }
        await User.insertMany([data])
        res.redirect('/login')
    }
} 

module.exports = userController;