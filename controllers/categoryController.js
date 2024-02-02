const Category = require('../models/category')

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
            res.render("admin/edit_Category",{category})
        }
        catch(error){
            console.log(error.message)
        }
    },
    postEdit_Category:async(req,res)=>{
        try{
            const uid = req.session.catid
            const { name, description} = req.body
            const category = await Category.findOneAndUpdate({_id:uid},{$set:{ name: name, description: description}})
            console.log(category)
            res.redirect("/admin/category")
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