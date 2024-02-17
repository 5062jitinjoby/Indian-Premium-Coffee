const express = require('express')
const userController = require('../controllers/userController')
const cartController = require('../controllers/cartController')
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
router.get('/profile',userware.userLogin,userController.getProfile)
router.get('/addAddress',userware.userLogin,userController.getAddAddress)
router.post('/addAddress',userware.userLogin,userController.postAddAddress)
router.get('/addresses',userware.userLogin,userController.getAddress)
router.get('/orders',userware.userLogin,userController.getOrders)

router.get('/cart',userware.userLogin,cartController.getCart)
router.post('/addToCart',userware.userLogin,cartController.postAddToCart)
router.post('/inc',userware.userLogin,cartController.incCart)
router.post('/dec',userware.userLogin,cartController.decCart)


router.get('/checkout',userware.userLogin,cartController.getCheckout)
router.get('/ordered',userware.userLogin,cartController.ordered)

router.get('/productDetails',userware.userLogin,userController.productDetails)

module.exports = router;