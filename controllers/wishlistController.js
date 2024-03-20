const User = require('../models/user')
const Products = require('../models/products');
const Wishlist = require('../models/wishlist')
const Cart = require('../models/cart')
const mongoose = require('mongoose')

const wishlistController = {
    wishlist:async(req,res)=>{
        try{
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const wishlist = await Wishlist.findOne({userID:usid}).populate('products.productID')
            res.render('user/wishlist',{user,wishlist})
        }
        catch(error){
            console.log(error.message);
        }
    },
    saveToWishlist:async(req,res)=>{
        try{
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const prid = req.query.id;
            const product = await Products.findOne({_id:prid})
            let stock;
            if(product.quantity>0){
                stock = 'In Stock';
            }
            else{
                stock = 'Out of Stock';
            }
            const cost = product.price;
            const wishlist = await Wishlist.findOne({userID:usid})
            if(wishlist){
                const productInWishlist = wishlist.products.filter(product=>product.productID==prid)
                if(productInWishlist.length == 0){
                    const productToUpdate = {productID:prid,stockStatus:stock,cost:cost}
                    const updateWishlist = await Wishlist.findOneAndUpdate({userID:usid},
                        {$push:{products:productToUpdate}},{new:true})
                    console.log(updateWishlist)
                }
            }
            else{
                const updateWishlist = await Wishlist.create({userID:usid,products:{productID:prid,stockStatus:stock,cost:cost}})
                console.log(updateWishlist)
            }
        }
        catch(error){
            console.log(error.message)
        }
    },
    moveToCart:async(req,res)=>{
        try{
            const productID = req.query.id
            const userID = req.session.user;
            console.log(userID)
            const cart = await Cart.findOne({userID:userID})
            const products = await Products.findOne({_id:productID})
            let cost;
            if(products.offerPrice){
                if(products.offerPrice!=0){
                    cost = products.offerPrice;
                }
            }
            else{
                cost = products.price;
            }
            console.log(cost)
            const wishlist = await Wishlist.findOne({userID:userID})
            const wishlistProduct = wishlist.products.filter(product=>product.productID==productID)
            if(wishlistProduct[0].stockStatus == 'In Stock'){
                if(cart){
                    const productToUpdate = cart.products.filter(product=>product.productID==productID)
                    if(productToUpdate.length == 0){
                        const updateCart = await Cart.findOneAndUpdate({userID:userID},
                            {$push:{products:{productID:productID,quantity:1,cost:cost}}},{new:true})
                        updateCart.billTotal = updateCart.billTotal + cost;
                        updateCart.subTotal = updateCart.subTotal + cost;
                        await updateCart.save()
                    }
                }
                else{
                    console.log("enenen");
                    console.log(userID);
                    const updateCart = await Cart.create({userID: new mongoose.Types.ObjectId(userID),
                        products:[{productID:productID,quantity:1,cost:cost}]})
                    updateCart.billTotal = cost;
                    updateCart.subTotal = cost;
                    await updateCart.save()
                }
                console.log("out");
                wishlist.products.forEach(product=>{
                    console.log(product.productID,productID);
                    if(product.productID == productID){
                        wishlist.products.pull(product);
                    }
                })
                
                await wishlist.save();
            } 
            res.json({success:true})
        }
        catch(error){
            console.log(error.message)
        }
    },
    remove:async(req,res)=>{
        try{
            const productID = req.query.id
            const userID = req.session.user;
            const wishlist = await Wishlist.findOne({userID:userID})
            wishlist.products.forEach(product=>{
                if(product.productID == productID){
                    wishlist.products.pull(product);
                }
            })
            await wishlist.save();
            res.json({success:true})
        }
        catch(error){
            console.log(error.message)
        }
    }
    
}

module.exports = wishlistController;
