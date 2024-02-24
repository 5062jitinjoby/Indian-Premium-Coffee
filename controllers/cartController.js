const User = require('../models/user')
const Products = require('../models/products');
const Address = require('../models/address')
const Cart = require('../models/cart');
const Orders = require('../models/orders')

const cart = {
    getCart:async(req,res)=>{
        try{
            const usid = req.session.user;
            const user = await User.findOne({_id:usid})
            const products= await Products.find({})
            const cart = await Cart.findOne({userID:usid}).populate('products.productID')
            
            res.render('user/cart',{cart,user})
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
            const cost = product.price;
            const cart = await Cart.findOne({userID:usid})
            if(cart){
                const productToUpdate = cart.products.filter(product=>product.productID==prid)
                // console.log(productToUpdate)
                // if(productToUpdate.length>0){
                //     // console.log('existing product')
                //     const quantity = 1;
                //     const updateCart = await Cart.findOneAndUpdate({userID:usid,'products.productID':prid},
                //                                             {$inc:{'products.$.quantity':quantity,'products.$.cost':cost}},
                //                                             {new:true})
                // }
                // else{
                    // console.log('new product')
                    if(productToUpdate.length == 0){
                        const product = {productID:prid,quantity:1}
                        const updateCart2 = await Cart.findOneAndUpdate({userID:usid},
                                            {$push:{products:{productID:prid,quantity:1,cost:cost}}},{new:true}) 
                    }
                     
                // }

            }
            else{
                const data1 = await Cart.create({userID:usid,products:{productID:prid,quantity:1,cost:cost}})
                // console.log(data1);
            }
            const updatedCart = await Cart.findOne({userID:usid})
            let billTotal = 0;
            updatedCart.products.forEach(product=>{
                billTotal+=product.cost;
            })
            const currentProduct = await Cart.findOneAndUpdate({userID:usid},{$set:{billTotal:billTotal}})
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
            const cost = product.price;
            const cart = await Cart.findOne({userID:usid})
            const quantity = 1;
            const cartPrdct = cart.products.filter(el=>el.productID==prid)
            let cartQty;
            cartPrdct.forEach(el=>{ cartQty = el.quantity})
            console.log(cartQty)
            if(cartQty<product.quantity){
                const updateCart = await Cart.findOneAndUpdate({userID:usid,'products.productID':prid},
                                                    {$inc:{'products.$.quantity':quantity,'products.$.cost':cost}},
                                                    {new:true})
                const billTotal = updateCart.billTotal;
                updateCart.billTotal=billTotal+cost;
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
            const cost = product.price;
            const cart = await Cart.findOne({userID:usid})
            const quantity = 1;
            const cartPrdct = cart.products.filter(el=>el.productID==prid)
            let cartQty;
            cartPrdct.forEach(el=>{ cartQty = el.quantity})
            console.log(cartQty)
            if(cartQty>1){
                const updateCart = await Cart.findOneAndUpdate({userID:usid,'products.productID':prid},
                                                    {$inc:{'products.$.quantity':-quantity,'products.$.cost':-cost}},
                                                    {new:true})
                const billTotal = updateCart.billTotal;
                updateCart.billTotal=billTotal-cost;
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
            console.log(id)
            const usid = req.session.user;
            const itemtoDelete = await Cart.findOneAndUpdate({userID:usid},{$pull:{products:{productID:id}}},{new:true})
            console.log(itemtoDelete);
            res.redirect('/cart')
        }
        catch(error){
            console.log(error.message)
        }
    },
    
}

module.exports = cart;