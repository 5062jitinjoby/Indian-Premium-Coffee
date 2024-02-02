const express = require('express')
const userController = require('../controllers/userController')
const router = express()
const userware = require('../middleware/userware')
router.set('view engine','ejs')
// router.set('views','/views/user')

router.get('/',userware.userLogout,userController.getL)
router.get('/login',userware.userLogout,userController.getLogin)
router.post('/login',userController.postLogin)

router.get('/logout',userController.logout)

router.get('/signup',userware.userLogout,userController.getsignup)
router.post('/signup',userController.postsignup)

router.get('/otp',userware.userLogout,userController.getOtp)
router.post('/otp',userController.postOtp)
router.post('/resendotp',userware.userLogout,userController.postResend)

router.get('/home',userware.userLogin,userController.getHome)

router.get('/productDetails',userware.userLogin,userController.productDetails)

module.exports = router;