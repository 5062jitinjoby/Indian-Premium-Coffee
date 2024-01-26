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
        res.render('user/login')
    },
    postLogin:async (req,res)=>{
        try{
            const userData = await User.findOne({email:req.body.email})
            const hashed = userData.password
            const password = req.body.password
            const verified = await bcrypt.compare(password,hashed)
            if(verified && userData.isActive == true){
                req.session.user=userData.fname
                res.redirect('/home')
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
        res.render('user/signup')
    },
    postsignup:async (req,res)=>{
        try{
            const check = await User.findOne({email:req.body.email});
            if(check && check.isActive == true){
                res.send('user already exists')
            }
            else{

                let data = {
                fname:req.body.firstName,
                lname:req.body.lastName,
                password:await bcrypt.hash(req.body.password,saltround),
                email:req.body.email,
                country:req.body.country,
                state:req.body.state,
                phNumber:req.body.phoneNumber
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
        if(data.isActive!=true){
            setTimeout(()=>{
                User.findOneAndDelete({_id:req.session.uid})
                res.redirect('/signup')
            },30000)
        }
        try{
            if(otp == req.body.otp){
                await User.updateOne({_id:uid},{$set:{isActive:true}})
                res.redirect('/login') 
            }
            else{
                res.render('user/otpverify',{message:'Incorrect Otp'})

            } 
        }
        catch{
            await User.findOneAndDelete({_id:req.session.uid})
            res.send('database error')
        }  
    },

    postResend:async(req,res)=>{
        res.redirect(`/otp?uid=${req.session.uid}`)
    },

    getHome:async(req,res)=>{
        try{
            const products = await Products.find()
            res.render('user/home',{products})
        }
        catch(error){
            console.log(error.message)
        }
    }

} 

module.exports = userController