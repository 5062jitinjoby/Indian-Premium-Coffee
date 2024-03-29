const Flavour = require('../models/flavour')
const Product = require('../models/products')
const Category = require('../models/category')
const ProductOffer = require('../models/productOffer')
const fs = require('fs').promises
const path = require('path')

const products = {

    //add products
    addProductGet: async (req, res) => {
        try {
            const flavours = await Flavour.find()
            const categories = await Category.find()
            res.render('admin/addProduct', { flavours, categories})
        }
        catch (error) {
            console.log(error.message)
        }

    },
    addProductPost: async (req, res) => {
        try {
            const images = req.files
            console.log(images);
            const image = images.map(file => file.filename)
            console.log(image)
            const data = {
                ProductName: req.body.name,
                Description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                category: req.body.category,
                flavour: req.body.flavour,
                image: image

            }
            await Product.create(data)
            res.redirect('/admin/addproduct')
        }
        catch (error) {
            console.log(error)
        }
    },

    //edit Product
    getEdit_product: async (req, res) => {
        try {
            const id = req.query.id
            req.session.uid = id;
            const categories = await Category.find({})
            const flavours = await Flavour.find({})
            const product = await Product.findOne({ _id: id }).populate('category').populate('flavour')
            console.log(product.flavour.id)
            res.render('admin/editProduct', { product, categories, flavours })
        }
        catch (error) {
            console.log(error)
        }

    },
    postEdit_product: async (req, res) => {
        try {
            const { name, description, price, quantity, category, flavour } = req.body
            if(req.files.length > 0){
            const images = req.files
            console.log(images);
            const image = images.map(file => file.filename)
                const productImage = await Product.findByIdAndUpdate({_id:req.session.uid},{$push:{image:image}})
             }
            const product = await Product.findOneAndUpdate({ _id: req.session.uid }, { $set: { ProductName:name, Description:description, price:price, quantity:quantity, category: category, flavour: flavour } },{new:true})
            res.redirect('/admin/productList')
        }
        catch (error) {
            console.log(error.message)
        }
    },
    removeImage:async (req,res)=>{
        try {
            const {imgid,proid} = req.query
            const findProduct = await Product.findById({_id:proid})
            console.log(findProduct)
            const delImageIndex = findProduct.image.indexOf(imgid)
            console.log(delImageIndex)
            findProduct.image.splice(delImageIndex,1)
            await findProduct.save()
            await fs.unlink(path.join(__dirname,'../uploads',imgid))
            res.json({success:"Deleted"})
        } catch (error) {
            console.log(error.message)
        }
    },
    //offer
    product_Offer:async(req,res)=>{
        try{
            const productID = req.query.id;
            const product = await Product.findOne({_id:productID}).populate('category')
            console.log(product);
            res.render('admin/productOffer',{product})
        }
        catch(error){
            console.log(error.message);
        }
    },
    post_product_Offer:async(req,res)=>{
        try{
            const productID = req.body.productID;
            const check = await ProductOffer.findOne({product:productID})
            const product = await Product.findOne({_id:productID});
            const offer = req.body.offer;
            if(!check){
                const product_Offer = await ProductOffer.create({product:productID,offer:offer})
                if(product.offerPrice != 0){
                    const offer_price = product.price*(offer/100)
                    const product_offer_price = product.price - offer_price
                    if(product.offerPrice > product_offer_price){
                        product.offerPrice = product.price - offer_price
                        await product.save()
                    }
                }
                res.redirect('/admin/productList') 
            }
        }
        catch(error){
            console.log(error.message)
        }
    },
    product_OfferList:async(req,res)=>{
        try{
            const product_OfferList = await ProductOffer.find().populate('product')
            console.log(product_OfferList)
            res.render('admin/product_offerlist',{product_OfferList})
        }
        catch(error){
            console.log(error.message);
        }
    },
    del_ProductOffer:async(req,res)=>{
        try{
            const productID = req.query.id;
            const product_Offer = await ProductOffer.findOne({product:productID})
            const product = await Product.findOne({_id:productID})
            const offer_price = product.price*(product_Offer.offer/100)
            const product_offer_price = product.price - offer_price
            if(product.offerPrice == product_offer_price){
                product.offerPrice = 0
                 await product.save()
            }
            await ProductOffer.findOneAndDelete({product:productID})
            res.redirect('/admin/product_OfferList')
        }
        catch(error){
            console.log(error.message)
        }
    },
    
    //status setting
    productStatus: async (req, res) => {
        try {
            const id = req.query.id
            const product = await Product.findOne({ _id: id })
            let status;
            if (product.isActive == true) {
                status = false
            }
            else {
                status = true
            }
            console.log(status)
            await Product.findByIdAndUpdate({ _id: id }, { $set: { isActive: status } })
            res.redirect('/admin/productList')
        }
        catch (error) {
            console.log(error.message)
        }
    },

    //product listing
    getListProducts: async (req, res) => {
        try {
            const products = await Product.find({}).populate('category')
            res.render('admin/productlist', { products })
        }
        catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = products