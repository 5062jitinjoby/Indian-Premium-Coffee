const Orders = require('../models/orders')
const Cart = require('../models/cart')
const User = require('../models/user')
const Address = require('../models/address')

const orderController = {
    ordered:async(req,res)=>{
        try{
            const usid = req.session.user;
            const {aid} = req.query
            const user = await User.findOne({_id:usid})
            const cart = await Cart.findOne({userID:usid})
            const order = await Orders.findOne({userID:usid})
            const currentDate = new Date();
            const address = await Address.findOne({userID:usid})
            let placedAddress
            address.addresses.forEach(el=>{
                if(el._id == aid){
                    placedAddress = el;
                }
            })
            console.log(placedAddress)
            if(order){
                const updatedOrder = await Orders.findOneAndUpdate({userID:usid},
                    {$push:{orders:[{products:cart.products,date:currentDate,address:placedAddress}]}},{new:true}) 
            }
            else{
                const updatedOrder = await Orders.create({userID:usid,
                    orders:[{products:cart.products,date:currentDate,address:placedAddress,status:'placed'}]},{new:true})
                console.log(cart.products)
            }
            const delCart = await Cart.findOneAndDelete({userID:usid})

            res.render('user/order',{user})
        }
        catch(error){
            console.log(error)
        }
    },
    getOrders:async(req,res)=>{
        try{
            const uid = req.session.user;
            const user = await User.findOne({_id:uid})
            const orders = await Orders.findOne({userID:uid}).populate('orders.products.productID')
            const reqorder = orders.orders.map(pr=>{
                console.log(pr)
            })
            
            res.render('user/userOrders',{orders,user})
        }
        catch(error){
            console.log(error.message)
        }
    },

    getOrderList:async(req,res)=>{
        try{
            const orders = await Orders.find().populate('userID').populate('orders.products.productID')
            orders.forEach(items=>{
                items.orders.forEach(item=>{
                    item.products.forEach(el=>{
                        console.log(el.productID.ProductName)
                    })
                }) 
            })
            res.render('admin/orderlist',{orders})
        }
        catch(error){
            console.log(error.message);
        }
    },
    orderStatus:async(req,res)=>{
        try{
            const userid = req.query.id;
            const prid = req.query.prid;
            const status = req.query.status;
            const product_Status = await Orders.findOne({userID:userid})
            product_Status.orders.forEach(item=>{
                item.products.forEach(el=>{
                    if(el._id == prid){
                        el.status=status;
                    }
                })
            })
            await product_Status.save()
            res.redirect('/admin/orders')
            console.log(status)
            
                
          
            
        }
        catch(error){
            console.log(error.message)
        }
    }
}

module.exports = orderController;