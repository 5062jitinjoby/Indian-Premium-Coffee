const Flavour = require('../models/flavour')
const Product = require('../models/products')
const Category = require('../models/category')
const Coupons = require('../models/coupon')
const Cart = require('../models/cart')
const User = require('../models/user')

const couponController = {
    // adding coupon

    getAddCoupon:async(req,res)=>{
        try{
            res.render('admin/addCoupon')
        }
        catch(error){
            console.log(error.message);
        }
    },
    postAddCoupon:async(req,res)=>{
        try{
            const newCoupon = {
                couponCode:req.body.coupon,
                minAmount:req.body.price,
                couponExpiry:req.body.date,
                discountPrice:req.body.discountPrice
            }
            const check = await Coupons.findOne({couponCode:req.body.coupon})
            if(check){
                res.render('admin/addCoupon',{message:'Coupon already exists',})
            }
            else{
                newCoupon.couponCode.trim()
                await Coupons.create(newCoupon)
                res.redirect('/admin/coupons')
            }
        }
        catch(error){
            console.log(error.message);
        }
    },

    couponList:async(req,res)=>{
        try{
            const coupons = await Coupons.find()
            res.render('admin/couponListing',{coupons})
        }
        catch(error){
            console.log(error.message)
        }
    },
    del_coupon:async(req,res)=>{
        try{
            const couponID = req.query.id;
            const coupon = await Coupons.findOneAndDelete({_id:couponID})
            res.redirect('/admin/coupons')
        }
        catch(error){
            console.log(error.message)
        }
    },
    couponApply:async(req,res)=>{
        try{
            const coupon = req.query.coupon
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const coupons = await Coupons.findOne({couponCode:coupon})
            const cart = await Cart.findOne({userID:usid}).populate('coupon')
            // const usedCoupons = user.coupons.filter(coupon => coupon.couponID.equals(coupons._id));
            // console.log(usedCoupons)
                
                if(cart.subTotal >= coupons.minAmount){
                    console.log('hi')
                    cart.coupon = coupons._id;
                    cart.billTotal  = cart.subTotal  - coupons.discountPrice;
                    console.log(cart.coupon)
                    cart.coupon = coupons._id;
                    
                    await cart.save();
                }
            res.redirect('/cart')
        }
        catch(error){
            console.log(error.message)
        }
    },
    couponRemove:async(req,res)=>{
        try{
            console.log('hi');
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const cart = await Cart.findOne({userID:usid})
            cart.coupon = null;
            cart.billTotal = cart.subTotal
            await cart.save();
            res.redirect('/cart')
        }
        catch(error){
            console.log(error.message)
        }
    }
}

module.exports = couponController;