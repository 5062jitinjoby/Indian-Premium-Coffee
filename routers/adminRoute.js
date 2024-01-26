const express = require('express')
const adminController = require('../controllers/adminController')
const categories = require('../controllers/categoryController')
const products = require('../controllers/productController')
const router = express()
const multer = require('multer')  

router.set('view engine','ejs')
// router.set('views','./views/admin')

const adminLogin = (req,res,next)=>{
    if(req.session.adminID){
        next()
    }
    else{
        res.redirect('/admin/login')
       
    }



}
const adminLogout= (req,res,next)=>{
    if(req.session.adminID){
        res.redirect("/admin/home")
    }
    else
    {
        next()
    }
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
});

const upload = multer({storage:storage})

router.get('/login',adminLogout,adminController.getLogin)
router.post('/login',adminLogout,adminController.postLogin)

router.get('/home',adminLogin,adminController.home)

router.get('/view_user',adminLogin,adminController.view_users)

router.get('/category',adminLogin,categories.getCategory)
router.post('/category',adminLogin,categories.postCategory)

router.get('/flavours',adminLogin,categories.getFlavour)
router.post('/flavours',adminLogin,categories.postFlavour)

router.get('/addProduct',adminLogin,products.addProductGet)
router.post('/addProduct',adminLogin,upload.array('images'),products.addProductPost)

router.get('/productList',adminLogin,products.getListProducts)

module.exports = router;