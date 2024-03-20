const Admin = require('../models/admin')
const User = require('../models/user')
const Orders = require('../models/orders')

const adminController ={

    // admin Login
    getLogin:(req,res)=>{
        res.render('admin/login',{message:''})
    },
    postLogin:async (req,res)=>{
        try{
            const userData = await Admin.findOne({adminID:req.body.adminId})
            if(userData.password === req.body.password){
                req.session.adminID = req.body.adminId
                res.redirect('/admin/home')
            }
            else{
                res.render('admin/login',{message:'Wrong password'})
            }
        }
        catch{
            res.send('Invalid Credentials')
        }   
    },

    logout:(req,res)=>{
        req.session.destroy();
        res.redirect('/admin/login')
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
    },
    user_Status:async(req,res)=>{
        try {
            const id = req.query.id
            const user = await User.findOne({ _id: id })
            let status;
            if (user.isActive == true) {
                status = false
            }
            else {
                status = true
            }
            console.log(status)
            await User.findByIdAndUpdate({ _id: id }, { $set: { isActive: status } })
            res.redirect('/admin/view_user')
        }
        catch (error) {
            console.log(error.message)
        }
    },
    getEdit_User:async(req,res)=>{
        try{
            const usid = req.query.id;
            req.session.usid = usid;
            const user = await User.findOne({_id:usid})
            res.render('admin/edit_User',{user})
        }
        catch(error){
            console.log(error.message)
        }
    },
    postEdit_User:async(req,res)=>{
        try{
            const usid = req.session.usid;
            const {fname,lname,email,country,state,PhNumber} = req.body
            const user = await User.findOneAndUpdate({_id:usid},{$set:{fname:fname,lname:lname,email:email,country:country,state:state,phNumber:PhNumber}})
        }
        catch(error){
            console.log(error.message)
        }
    }
}

module.exports = adminController;