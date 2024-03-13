const User = require('../models/user')
const Products = require('../models/products');
const Address = require('../models/address')
const Cart = require('../models/cart');
const Wishlist = require('../models/wishlist')
const Orders = require('../models/orders')
const Coupons = require('../models/coupon')
const cart = {
    getCart:async(req,res)=>{
        try{
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const products= await Products.find({})
            const cart = await Cart.findOne({userID:usid}).populate('products.productID').populate('coupon')
            const coupons = await Coupons.find()
            res.render('user/cart',{cart,user,coupons})
        }
        catch(error){
            console.log(error.message)
        }

    },
    postAddToCart:async(req,res)=>{
        try{
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const prid = req.query.id;
            const product = await Products.findOne({_id:prid})
            let cost; 
            const cart = await Cart.findOne({userID:usid})
            if(product.offerPrice!=0){
                cost = product.offerPrice;
            }
            else{
                cost = product.price;
            }
            if(cart){
                const productToUpdate = cart.products.filter(product=>product.productID==prid)
                    if(productToUpdate.length == 0){
                        const product = {productID:prid,quantity:1}
                        const updateCart2 = await Cart.findOneAndUpdate({userID:usid},
                                            {$push:{products:{productID:prid,quantity:1,cost:cost}}},{new:true}) 
                    }

            }
            else{
                const data1 = await Cart.create({userID:usid,products:{productID:prid,quantity:1,cost:cost}})
            }
            const updatedCart = await Cart.findOne({userID:usid})
            let billTotal = 0;
            let subTotal = 0;
            updatedCart.products.forEach(product=>{
                billTotal+=product.cost;
                subTotal+=product.cost;
            })
            const currentProduct = await Cart.findOneAndUpdate({userID:usid},{$set:{billTotal:billTotal,subTotal:subTotal}})
            console.log(currentProduct)
        }
        catch(error){
            console.log(error.message)
        }
        
    },
    incCart:async(req,res)=>{
        try{
            const prid =req.query.id
            console.log(prid)
            const usid = req.session.user;
            const product = await Products.findOne({_id:prid})
            let cost;
            const cart = await Cart.findOne({userID:usid})
            const quantity = 1;
            const cartPrdct = cart.products.filter(el=>el.productID==prid)
            let cartQty;
            cartPrdct.forEach(el=>{ cartQty = el.quantity})
            console.log(cartQty)
            if(product.offerPrice!=0){
                cost = product.offerPrice;
            }
            else{
                cost = product.price;
            }
            if(cartQty<product.quantity){
                const updateCart = await Cart.findOneAndUpdate({userID:usid,'products.productID':prid},
                                                    {$inc:{'products.$.quantity':quantity,'products.$.cost':cost}},
                                                    {new:true})
                const billTotal = updateCart.billTotal;
                updateCart.billTotal=billTotal+cost;
                updateCart.subTotal = updateCart.subTotal + cost
                await updateCart.save();
            }
            res.json({success:true})
        }
        catch(error){
            console.log(error)
        }
    },
    
    decCart:async(req,res)=>{
        try{
            const prid =req.query.id
            console.log(prid)
            const usid = req.session.user;
            const product = await Products.findOne({_id:prid})
            let cost;
            const cart = await Cart.findOne({userID:usid}).populate('coupon')
            const quantity = 1;
            const minPurchase = cart.coupon.minAmount
            const cartPrdct = cart.products.filter(el=>el.productID==prid)
            let cartQty;
            cartPrdct.forEach(el=>{ cartQty = el.quantity})
            console.log(cartQty)
            if(product.offerPrice!=0){
                cost = product.offerPrice;
            }
            else{
                cost = product.price;
            }
            if(cartQty>1){
                const updateCart = await Cart.findOneAndUpdate({userID:usid,'products.productID':prid},
                                                    {$inc:{'products.$.quantity':-quantity,'products.$.cost':-cost}},
                                                    {new:true})
                updateCart.subTotal = updateCart.subTotal - cost
                if(cart.coupon){
                    console.log('subTotal'+updateCart.subTotal)
                    if(updateCart.subTotal<minPurchase){
                        updateCart.coupon = null;
                        updateCart.billTotal = updateCart.subTotal
                    }
                    else{
                        updateCart.billTotal = updateCart.billTotal - cost
                    }
                }
                else{
                    updateCart.billTotal = updateCart.billTotal - cost
                }
                await updateCart.save();
            }
            res.json({success:true})
        }
        catch(error){
            console.log(error.message)
        }
    },
    

    //checkout
    getCheckout:async(req,res)=>{
        try{
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const products= await Products.find({})
            const cart = await Cart.findOne({userID:usid}).populate('products.productID')
            const address = await Address.findOne({userID:usid})
            console.log(cart)
            res.render('user/checkout',{cart,address,user})
        }
        catch(error){
            console.log(error.message)
        }
    },

    deleteItem:async(req,res)=>{
        try{
            const id = req.query.id
            console.log('item delete in cart')
            const usid = req.session.user;
            const cart = await Cart.findOne({userID:usid}).populate('coupon')
            let cost;
            let discount;
            cart.products.filter(product=>{if(product.productID==id){cost = product.cost}})
            cart.products.pull({productID:id})
            if(cart.coupon){
                discount = cart.coupon.discountPrice
                cart.coupon = null;
                cart.billTotal = cart.billTotal -  cost + discount;
                cart.subTotal = cart.subTotal - cost;
            }
            else{
                cart.billTotal = cart.billTotal -  cost;
                cart.subTotal = cart.subTotal - cost;
            }
            
            console.log(cost)
            await cart.save()
            res.redirect('/cart')
        }
        catch(error){
            console.log(error.message)
        }
    },

    
    
}

module.exports = cart;