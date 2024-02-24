const express = require('express')
const adminController = require('../controllers/adminController')
const categories = require('../controllers/categoryController')
const products = require('../controllers/productController')
const orderController = require('../controllers/orderController')
const router = express()
const adminware = require('../middleware/adminware')
const multer = require('multer')

router.set('view engine', 'ejs')
// router.set('views','./views/admin')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage })

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

router.get('/flavours', adminware.adminLogin, categories.getFlavour)
router.post('/flavours', categories.postFlavour)
router.get('/edit_flavours', adminware.adminLogin, categories.getEdit_Flavour)
router.put('/edit_flavours', categories.postEdit_Flavour)
router.get('/del_flavour', adminware.adminLogin, categories.del_Flavour)

router.get('/addProduct', adminware.adminLogin, products.addProductGet)
router.post('/addProduct', upload.array('images'), products.addProductPost)

router.get('/edit_Product', adminware.adminLogin, products.getEdit_product)
router.put('/edit_product', upload.array('images'), products.postEdit_product)
router.get('/editproduct/removeimage', adminware.adminLogin, products.removeImage)
router.get('/status', adminware.adminLogin, products.productStatus)

router.get('/orders',adminware.adminLogin,orderController.getOrderList)
router.get('/orders/status',adminware.adminLogin,orderController.orderStatus)

router.get('/productList', adminware.adminLogin, products.getListProducts)

module.exports = router;