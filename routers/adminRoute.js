const express = require('express')
const adminController = require('../controllers/adminController')
const categories = require('../controllers/categoryController')
const products = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const couponController = require('../controllers/couponController')
const router = express()
const adminware = require('../middleware/adminware')
const multer = require('multer')
const config = require('../config')

router.set('view engine', 'ejs')

const upload = multer({ storage: config.storage })

router.get('/login', adminware.adminLogout, adminController.getLogin)
router.post('/login', adminController.postLogin)

router.get('/logout', adminController.logout)

router.get('/home', adminware.adminLogin, adminController.home)

router.get('/view_user', adminware.adminLogin, adminController.view_users)
router.get('/user_Status', adminware.adminLogin, adminController.user_Status)

router.get('/category', adminware.adminLogin, categories.getCategory)
router.post('/category', adminware.adminLogin, categories.postCategory)
router.get('/edit_category', adminware.adminLogin, categories.getEdit_Category)
router.put('/edit_category', adminware.adminLogin, categories.postEdit_Category)
router.get('/category_Status', adminware.adminLogin, categories.categoryStatus)
router.get('/del_category', adminware.adminLogin, categories.del_Category)
router.get('/category_Offers',adminware.adminLogin,categories.getcategoryOffer)
router.post('/category_Offers',adminware.adminLogin,categories.postcategoryOffer)
router.get('/edit_category_Offer',adminware.adminLogin,categories.getedit_CategoryOffer)
router.put('/edit_category_Offer',adminware.adminLogin,categories.putedit_CategoryOffer)
router.get('/del_category_Offer',adminware.adminLogin,categories.del_category_Offer)

router.get('/flavours', adminware.adminLogin, categories.getFlavour)
router.post('/flavours',adminware.adminLogin ,categories.postFlavour)
router.get('/edit_flavours', adminware.adminLogin, categories.getEdit_Flavour)
router.put('/edit_flavours', adminware.adminLogin,categories.postEdit_Flavour)
router.get('/del_flavour', adminware.adminLogin, categories.del_Flavour)

router.get('/addProduct', adminware.adminLogin, products.addProductGet)
router.post('/addProduct',adminware.adminLogin, upload.array('images'), products.addProductPost)

router.get('/edit_Product', adminware.adminLogin, products.getEdit_product)
router.put('/edit_product', adminware.adminLogin,upload.array('images'), products.postEdit_product)
router.get('/editproduct/removeimage', adminware.adminLogin, products.removeImage)
router.get('/status', adminware.adminLogin, products.productStatus)

router.get('/product_OfferList',adminware.adminLogin,products.product_OfferList)
router.get('/product_Offer',adminware.adminLogin,products.product_Offer)
router.post('/product_Offer',adminware.adminLogin,products.post_product_Offer)
router.get('/del_product_Offer',adminware.adminLogin,products.del_ProductOffer)

router.get('/orders',adminware.adminLogin,orderController.getOrderList)
router.get('/orders/orderDetails',adminware.adminLogin,orderController.orderDetails)
router.get('/orders/status',adminware.adminLogin,orderController.orderStatus)

router.get('/addCoupon',adminware.adminLogin,couponController.getAddCoupon)
router.post('/addCoupon',adminware.adminLogin,couponController.postAddCoupon)
router.get('/coupons',adminware.adminLogin,couponController.couponList)
router.get('/del_coupon',adminware.adminLogin,couponController.del_coupon)

router.get('/productList', adminware.adminLogin, products.getListProducts)

router.post('/getcustomReport',adminware.adminLogin,orderController.getcustomReport)
router.get('/reportInExcel',adminware.adminLogin,orderController.salesReportinExcel)
router.get('/reportInPdf',adminware.adminLogin,orderController.salesReportinPdf)

module.exports = router;