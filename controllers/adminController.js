const Admin = require('../models/admin')
const User = require('../models/user')

const adminController ={

    // admin Login
    getLogin:(req,res)=>{
        res.render('admin/login')
    },
    postLogin:async (req,res)=>{
        try{
            const userData = await Admin.findOne({adminID:req.body.adminId})
            if(userData.password === req.body.password){
                req.session.adminID = req.body.adminId
                res.redirect('/admin/home')
            }
            else{
                res.send('Wrong password')
            }
        }
        catch{
            res.send('Invalid Credentials')
        }   
    },

    //admin dashboard
    home:(req,res)=>{
        res.render('admin/home')
    },

    view_users:async(req,res)=>{
        try{
            const users = await User.find();
            res.render('admin/view_user',{users});
        }
        catch(error) {
            console.log(error);
            res.send('Sever error');
        }
    }
}

module.exports = adminController;