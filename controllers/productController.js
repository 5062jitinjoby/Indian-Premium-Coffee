const Flavour = require('../models/flavour')
const Product = require('../models/products') 
const Category = require('../models/category')
   
   const products = {

        //add products
        addProductGet:async(req,res)=>{
            try{
                const flavours = await Flavour.find()
                const categories = await Category.find() 
                res.render('admin/addProduct',{flavours,categories})
            }
            catch(error){
                console.log(error.message)
            }

        },
        addProductPost:async (req,res)=>{
            try{
                const images=req.files
                console.log(images);
                const image = images.map(file=>file.filename)
                console.log(image)
                const data ={
                    ProductName:req.body.name,
                    Description:req.body.description,
                    price:req.body.price,
                    quantity:req.body.quantity,
                    category:req.body.category,
                    flavour:req.body.flavour,
                    image:image
                    
                }
                await Product.create(data)
                res.redirect('/admin/addproduct')
            }
            catch(error){
                console.log(error)
            }
        },

        //product listing
        getListProducts:async(req,res)=>{
            try{
                const products = await Product.find({})
                console.log(products)
                res.render('admin/productlist',{products})
            }
            catch(error){
                console.log(error.message);
            }
        }
    }

    module.exports = products