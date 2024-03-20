const mongoose = require('mongoose');
const User = require('../models/user')
const Products = require('../models/products')
const Category = require('../models/category')
const Address = require('../models/address')
const Orders = require('../models/orders')
const Wallet = require('../models/wallet')
const getotp = require('../otp')
const bcrypt = require('bcrypt')
const saltround=10;

function generateReferralCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    
    for (let i = 0; i < length; i++) {
      referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return referralCode;
}

const userController ={
    //login
    getL:(req,res)=>{
        res.redirect('/home')
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
                const uniqueReferralCode = generateReferralCode(8);
                let data = {
                username:req.body.username,
                password:await bcrypt.hash(req.body.password,saltround),
                email:req.body.email,
                phoneNumber:req.body.phoneNumber,
                referalCode:uniqueReferralCode
                }
                const userData = await User.create(data)
                if(req.body.referal){
                    req.session.referal = req.body.referal;
                }
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
        let data = await User.findOne({_id:uid})
        try{
            if(otp == req.body.otp){
                await User.updateOne({_id:uid},{$set:{isActive:true}})
                if(req.session.referal){
                    const newWallet = {
                        userID: uid,
                        balance: 50,
                        transactions: [
                          {
                            transactionID: 'refer',
                            transactionType: "Referal",
                            date: new Date(),
                            amount: 50,
                          },
                        ],
                    };
                    await Wallet.create(newWallet);
                    const referedUser = await User.findOne({referalCode:req.session.referal})
                    const referedUserWallet = await Wallet.findOne({userID:referedUser._id})
                    if(referedUserWallet){
                        referedUserWallet.balance = referedUserWallet.balance + 50;
                        const transaction = {
                        transactionID: 'refer',
                        transactionType: "Referal",
                        date: new Date(),
                        amount: 50,
                        };
                        referedUserWallet.transactions.push(transaction);
                        await referedUserWallet.save();
                    }
                    else{
                        const referWallet = {
                            userID: referedUser._id,
                            balance: 50,
                            transactions: [
                              {
                                transactionID: 'refer',
                                transactionType: "Referal",
                                date: new Date(),
                                amount: 50,
                              },
                            ],
                        };
                        await Wallet.create(referWallet);  
                    }
                }
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
            const currentPage = req.query.page || 1;
            const pageLimit = 8;
            const productCount = await Products.find({isActive:true}).count()
            const startIndex = (currentPage - 1) * pageLimit;
            const endIndex = currentPage * pageLimit;
            const products = await Products.find({ isActive: true })
                .populate('category')
                .skip(startIndex)
                .limit(pageLimit);
            const category = await Category.find();
            const totalPages = Math.ceil(productCount / pageLimit);
            if(req.session.user){
                const user = await User.findOne({_id:req.session.user})
                res.render('user/home',{products,user,
                    category,
                    currentPage,
                    totalPages,startIndex,endIndex})
            }
            else{
                res.render('user/home',{products,
                    category,
                    currentPage,
                    totalPages,startIndex,endIndex})
            }
            
        }
        catch(error){
            console.log(error.message)
        }
    },
    categoryFilter:async(req,res)=>{
        try{
            const categorId = req.query.selectedCategory
            const products = await Products.find().populate('category')
            const user = await User.findOne({_id:req.session.user})
            const category = await Category.find() 
            const categorProduct = products.filter(product=>product.category._id==categorId)

            res.render('user/categoryFilter',{categorProduct,category,user})
            console.log(categorProduct);
        }
        catch(error){
            console.log(error.message);
        }
    },


    //profile
    getProfile:async(req,res)=>{
        try{
            const uid = req.session.user
            const user = await User.findOne({_id:uid})
            const category = await Category.find() 
            res.render('user/userProfile',{user,category})
        }
        catch(error){
            console.log(error.message);
        }
    },

    getAddAddress:async(req,res)=>{
        try{
            const uid = req.session.user
            const user = await User.findOne({_id:uid})
            const category = await Category.find() 
            res.render('user/userAddAddress',{user,category})
        }
        catch(error){
            console.log(error)
        }
    },

    postAddAddress:async(req,res)=>{
        try{
            const{name,mobile,pincode,locality,address,city,state,country}=req.body
            //console.log(`name:${name},mobile:${mobile},pincode:${pincode},locality:${locality},address:${address},city:${city},state:${state},country:${country}`)
            const uid = req.session.user;
            const usradd = await Address.findOne({userID:uid})
            if(usradd){
                const addAddress =  await Address.findOneAndUpdate({userID:uid},
                    {$push:{addresses:{Name:name,Mobile:mobile,Pincode:pincode,Locality:locality,Address:address,City:city,State:state,Country:country}}},{new:true})
            }
            else{
                const addAddress =  await Address.create({userID:uid},
                    {addresses:[{Name:name,Mobile:mobile,Pincode:pincode,Locality:locality,Address:address,City:city,State:state,Country:country}]})
                    console.log(addAddress)
            }
            
        }
        catch(error){
            console.log(error)
        }
    },

    getAddress:async(req,res)=>{
        try{
            const uid = req.session.user;
            const user = await User.findOne({_id:uid})
            const address = await Address.findOne({userID:uid})
            const category = await Category.find() 
            console.log(address.addresses[0].Name)
            res.render('user/userAddress',{address,user,category})
        }
        catch(error){
            console.log(error.message);
        }
    },

    changePassword:async(req,res)=>{
        try{
            const uid = req.session.user;
            const user = await User.findOne({_id:uid})
            const category = await Category.find() 
            res.render('user/changePassword',{category,user,message:''})
        }
        catch(error){
            console.log(error.message)
        }
    },

    productDetails:async(req,res)=>{
        try{
            const productID = req.query.id;
            if (!mongoose.Types.ObjectId.isValid(productID)) {
                res.status(404).render('404');
                return;
            }
            const user = await User.findOne({_id:req.session.user}) 
            const product = await Products.findOne({_id:productID})
            const category = await Category.find() 
            res.render('user/productDetails',{product,user,category})
        }
        catch(error){
            console.log(error.message)
        }
    },

    putChangePassword:async(req,res)=>{
        try{
            const user = await User.findOne({_id:req.session.user})
            const hashed = user.password
            const password = req.body.currentPassword
            const verified = await bcrypt.compare(password,hashed)
            const category = await Category.find() 
            if(verified){
                if(req.body.confirmNewPassword == re.body.newPassword){
                    const updatedPassword = await bcrypt.hash(req.body.confirmNewPassword,saltround)
                    const updatedUser = await User.findOneAndUpdate({_id:req.session.user},{$set:{password:updatedPassword}})
                    res.redirect('/logout')
                }
                else{
                    res.render('user/changePassword',{user,category,message:'New Password and Confirm NewPassword must match'})
                }
            }
            else{
                res.render('user/changePassword',{user,category,message:'Enter correct password'})
            }

        }
        catch(error){
            console.log(error.message)
        }
    },

    getEditAddress:async(req,res)=>{
        try{
            const userID = req.session.user
            const addressID = req.query.id
            req.session.addressID = addressID
            const user = await User.findOne({_id:userID})
            const address = await Address.findOne({userID:userID})
            const category = await Category.find() 
            let editAddress;
            address.addresses.forEach(el=>{
                if(el._id == addressID){
                    editAddress = el;
                }
            })
            console.log(editAddress)
            res.render('user/userEditAddress',{editAddress,category,user})
        }
        catch(error){
            console.log(error.message)
        }
    },
    putEditAddress:async(req,res)=>{
        try{
            const{name,mobile,pincode,locality,address,city,state,country}=req.body
            const uid = req.session.user;
            const addressID = req.session.addressID;
            const usradd = await Address.findOne({userID:uid})
            usradd.addresses.forEach(el=>{
                if(el._id == addressID){
                    el.Name = name;
                    el.Mobile = mobile;
                    el.Pincode = pincode;
                    el.Locality = locality;
                    el.Address = address;
                    el.City = city;
                    el.State = state;
                    el.Country = country;
                }
            })
            await usradd.save();
            res.redirect('/addresses')  
        }
        catch(error){
            console.log(error.message)
        }
    },
    getDelAddress:async(req,res)=>{
        try{
            const userID = req.session.user
            const addressID = req.query.id
            req.session.addressID = addressID
            const user = await User.findOne({_id:userID})
            const address = await Address.findOneAndUpdate({userID:userID},{$pull:{addresses:{_id:addressID}}})
            res.redirect('/addresses')
        }
        catch(error){
            console.log(error.message)
        }
    }

} 

module.exports = userController