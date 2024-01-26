const Category = require('../models/category')

const Flavour = require('../models/flavour')

const categories = {
    getCategory:async(req,res)=>{
        const categories = await Category.find()
        res.render('admin/category',{categories})
    },
    postCategory:async(req,res)=>{
        try{
            const data = {
                name:req.body.name,
                description:req.body.description
            }
            await Category.create(data)
            res.redirect('/admin/category')
        }
        catch(error){
            console.log(error)
        }
    },

    getFlavour:async(req,res)=>{
        const flavours = await Flavour.find()
        res.render('admin/flavours',{flavours})
    },
    postFlavour:async(req,res)=>{
        try{
            const data = {
                name:req.body.flavourName,
                description:req.body.flavourDes
            }
            await Flavour.create(data)
            res.redirect('/admin/flavours')
        }
        catch(error){
            console.log(error)
        }
    }
}

module.exports = categories