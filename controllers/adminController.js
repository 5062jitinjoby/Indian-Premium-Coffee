const Admin = require('../models/admin')

const adminController ={
    getLogin:(req,res)=>{
        res.render('login')
    },
    postLogin:(req,res)=>{
        res.render('login')
    }
}

module.exports = adminController;