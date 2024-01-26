const express = require('express')
const userController = require('../controllers/userController')
const router = express()

const userLogin = (req,res,next)=>{
    if(req.session.user){
        next()
    }
    else{
        res.redirect('/login')
       
    }



}
const userLogout= (req,res,next)=>{
    if(req.session.user){
        res.redirect("/home")
    }
    else
    {
        next()
    }
}

router.set('view engine','ejs')
// router.set('views','/views/user')

router.get('/',userLogout,userController.getL)
router.get('/login',userLogout,userController.getLogin)
router.post('/login',userLogout,userController.postLogin)

router.get('/signup',userLogin,userController.getsignup)
router.post('/signup',userLogin,userController.postsignup)

router.get('/otp',userLogin,userController.getOtp)
router.post('/otp',userLogin,userController.postOtp)
router.post('/resendotp',userLogin,userController.postResend)

router.get('/home',userLogin,userController.getHome)

module.exports = router;