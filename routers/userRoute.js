const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.get('/',userController.getL)
router.get('/login',userController.getLogin)
router.post('/login',userController.postLogin)

router.get('/signup',userController.getsignup)
router.post('/signup',userController.postsignup)

module.exports = router;