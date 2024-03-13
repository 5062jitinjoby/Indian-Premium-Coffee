const Category = require('../models/category')
const CategoryOffer = require('../models/categoryOffer')
const Flavour = require('../models/flavour')
const Products = require('../models/products')

const categories = {

    //category management
    getCategory:async(req,res)=>{
        const categories = await Category.find()
        res.render('admin/category',{message:'',categories})
    },
    postCategory:async(req,res)=>{
        try{
            const categories = await Category.find()
            const check = await Category.findOne({name:req.body.name})
            if(check){
                res.render('admin/category',{message:'Category already exists',categories})
            }
            else{
                const data = {
                    name:req.body.name,
                    description:req.body.description
                }
                data.name.trim()
                await Category.create(data)
                res.redirect('/admin/category')
            }
        }
        catch(error){
            console.log(error)
        }
    },

    //edit category
    getEdit_Category:async(req,res)=>{
        try{
            const uid = req.query.id
            console.log(uid)
            req.session.catid = uid;
            const category = await Category.findOne({_id:uid})
            res.render("admin/edit_Category",{category,message:''})
        }
        catch(error){
            console.log(error.message)
        }
    },
    postEdit_Category:async(req,res)=>{
        try{
            const uid = req.session.catid
            const { name, description} = req.body
            let category = await Category.findOne({_id:uid})
            const catname = name.trim()
            console.log(catname);
            if(catname != category.name){
                const ucat = await Category.findOne({name:catname})
                console.log(ucat)
                if(!ucat){
                    category = await Category.findOneAndUpdate({_id:uid},{$set:{ name: catname, description: description}})
                    res.redirect('/admin/category')
                }
                else{
                    res.render("admin/edit_Category",{category,message:'Category already exists'})
                }  
            }
            else{
                category = await Category.findOneAndUpdate({_id:uid},{$set:{ name: catname, description:description}})
                res.redirect('/admin/category')
                console.log(category)
            }
            
            
        }
        catch(error){
            console.log(error.message)
        }
    },

    del_Category:async(req,res)=>{
        try{
            const uid=req.query.id;
            const category = await Category.findOneAndDelete({_id:uid})
            res.redirect('/admin/category')
        }
        catch(error){
            console.log(error.message)
        }
    },

    getcategoryOffer:async(req,res)=>{
        try{
            const categories = await Category.find()
            const categor_Offers = await CategoryOffer.find().populate('category')
            res.render('admin/category_Offers',{categories,categor_Offers,message:''})
        }
        catch(error){
            console.log(error.message)
        }
    },
    postcategoryOffer:async(req,res)=>{
        try{
            const {category,offer} = req.body
            const check = await CategoryOffer.findOne({category:category})
            const products = await Products.find({category:category});
            console.log(products)
            if(!check){
                const categor_Offer = await CategoryOffer.create({category:category,offer:offer})
                for(const product of products){
                    if(product.offerPrice != 0){
                        const offer_price = product.price*(offer/100)
                        const product_offer_price = product.price - offer_price
                        if(product.offerPrice > product_offer_price){
                            product.offerPrice = product.price - offer_price
                            await product.save()
                        }
                    } 
                }
                res.redirect('/admin/category_Offers')    
            }
            else{
                const categories = await Category.find()
                const categor_Offers = await CategoryOffer.find().populate('category')
                res.render('admin/category_Offers',{categories,categor_Offers,message:'Already an offer is applied to this category'})
            }
        }
        catch(error){
            console.log(error.message)
        }
        
    },
    getedit_CategoryOffer:async(req,res)=>{
        try{
            const categoryid = req.query.id
            req.session.categor_Offer = categoryid
            const categor_Offer = await CategoryOffer.findOne({_id:categoryid}).populate('category')
            res.render('admin/edit_category_offer',{categor_Offer,message:''})
        }
        catch(error){
            console.log(error.message);
        }
    },
    putedit_CategoryOffer:async(req,res)=>{
        try{
            const categor_OfferID = req.session.categor_Offer;
            const offer = req.body.offer;
            const categor_Offer = await CategoryOffer.findOne({_id:categor_OfferID}).populate('category')
            const products = await Products.find({category:categor_Offer.category._id});
            if(categor_Offer.offer != offer){
                const category_Offer = await CategoryOffer.findOneAndUpdate({_id:categor_OfferID},{$set:{offer:offer}},{upsert:true})
                for(const product of products){
                    const offer_price = product.price*(offer/100)
                    product.offerPrice = product.price - offer_price
                    await product.save()
                }
            }
            res.redirect('/admin/category_Offers') 
        }
        catch(error){
            console.log(error.message);
        }
    },
    del_category_Offer:async(req,res)=>{
        try{
            const categor_OfferID=req.query.id;
            const categor_Offer = await CategoryOffer.findOneAndDelete({_id:categor_OfferID}).populate('category')
            const products = await Products.find({category:categor_Offer.category._id});
            for(const product of products){
                product.offerPrice = 0;
                await product.save()
            }
            res.redirect('/admin/category_Offers')
        }
        catch(error){
            console.log(error.message)
        }
    },


    // Flavour Management
    getFlavour:async(req,res)=>{
        const flavours = await Flavour.find()
        res.render('admin/flavours',{message:'',flavours})
    },
    postFlavour:async(req,res)=>{
        try{
            const flavours = await Flavour.find()
            const check = await Flavour.findOne({name:req.body.name})
            if(check){
                res.render('admin/flavours',{message:'Flavour already exists',flavours})
            }
            else{
                const data = {
                    name:req.body.name,
                    description:req.body.description
                }
                await Flavour.create(data)
                res.redirect('/admin/flavours')

            }
        }
        catch(error){
            console.log(error)
        }
    },

    //edit flavour
    getEdit_Flavour:async(req,res)=>{
        try{
            const uid=req.query.id
            req.session.fid = uid
            const flavour = await Flavour.findOne({_id:uid})
            res.render('admin/edit_flavour',{flavour})
        }
        catch(error){
            console.log(error.message)
        }
    },
    postEdit_Flavour:async(req,res)=>{
        try{
            const uid=req.session.fid 
            const {name,description} = req.body
            const flavour = await Flavour.findOneAndUpdate({_id:uid},{$set:{name:name, description:description}})
            res.redirect('/admin/flavours')
        }
        catch(error){
            console.log(error.message)
        }
    },

    //set status
    categoryStatus: async (req, res) => {
        try {
            const id = req.query.id
            const category = await Category.findOne({ _id: id })
            let status;
            if (category.isActive == true) {
                status = false
            }
            else {
                status = true
            }
            console.log(status)
            await Category.findByIdAndUpdate({ _id: id }, { $set: { isActive: status } })
            await Products.updateMany({category:category._id},{$set:{isActive:status}})
            res.redirect('/admin/category')
        }
        catch (error) {
            console.log(error.message)
        }
    },

    //delete category
    del_Flavour:async(req,res)=>{
        try{
            const uid=req.query.id;
            const flavour = await Flavour.findOneAndDelete({_id:uid})
            res.redirect('/admin/flavours')
        }
        catch(error){
            console.log(error.message)
        }
    }

}

module.exports = categories