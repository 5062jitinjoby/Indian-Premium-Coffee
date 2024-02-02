const User = require('../models/user')
const Products = require('../models/products')
const getotp = require('../otp')
const bcrypt = require('bcrypt')
const saltround=10;

const userController ={
    //login
    getL:(req,res)=>{
        res.redirect('/login')
    },
    getLogin:(req,res)=>{
        res.render('user/login',{message:''})
    },
    postLogin:async (req,res)=>{
        try{
            const userData = await User.findOne({email:req.body.email})
            const hashed = userData.password
            const password = req.body.password
            const verified = await bcrypt.compare(password,hashed)
            if(verified && userData.isActive == true){
                req.session.user=userData._id
                res.redirect('/home')
            }
            else{
                res.render('user/login',{message:'Wrong password'})
            }
        }
        catch{
            res.render('user/login',{message:'Invalid Credentials'})
        }   
    },

    logout:(req,res)=>{
        req.session.destroy();
        res.redirect('/login')
    },

    //signUp
    getsignup:(req,res)=>{
        res.render('user/signup',{message:''})
    },
    postsignup:async (req,res)=>{
        try{
            const check = await User.findOne({email:req.body.email});
            if(check && check.isActive == true){
                res.render('user/signup',{message:'User already exists'})
            }
            else{

                let data = {
                username:req.body.username,
                password:await bcrypt.hash(req.body.password,saltround),
                email:req.body.email,
                phoneNumber:req.body.phoneNumber
                }
                const userData = await User.create(data)
                const uid = userData._id;
                res.redirect(`/otp?uid=${uid}`)
            }
        }
        catch(error){
            console.log(error.message)
        }
        
    },

    // Otp request
    getOtp:async(req,res)=>{
        const uid = req.query.uid
        const data = await User.findOne({_id:uid})
        req.session.uid=uid
        const email = data.email;
        console.log(email);
        let otp = await getotp(email);
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes()+1)
        req.session.otp = otp;
        console.log(req.session)
        res.render('user/otpverify',{message:''})

    },
    postOtp:async(req,res)=>{
        let otp = req.session.otp;
        let uid = req.session.uid;
        let data = User.findOne({_id:uid})
        try{
            if(otp == req.body.otp){
                await User.updateOne({_id:uid},{$set:{isActive:true}})
                res.redirect('/login') 
            }
            else{
                res.render('user/otpverify',{message:'Incorrect Otp'})

            } 
        }
        catch(error){
            await User.findOneAndDelete({_id:req.session.uid})
            console.log(error.message)
        }  
    },

    postResend:async(req,res)=>{
        res.redirect(`/otp?uid=${req.session.uid}`)
    },

    getHome:async(req,res)=>{
        try{
            const user = await User.findOne({_id:req.session.user}) 
            const products = await Products.find().populate('category')
            res.render('user/home',{products,user})
        }
        catch(error){
            console.log(error.message)
        }
    },

    productDetails:async(req,res)=>{
        try{
            const user = await User.findOne({_id:req.session.user}) 
            const uid = req.query.id;
            const product = await Products.findOne({_id:uid})
            res.render('user/productDetails',{product,user})
        }
        catch(error){
            console.log(error.message)
        }
    }

} 

module.exports = userController