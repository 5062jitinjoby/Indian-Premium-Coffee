const Wallet = require('../models/wallet')
const User = require('../models/user')

const walletController = {
    wallet:async(req,res)=>{
        try{
            const userID = req.session.user
            const wallet = await Wallet.findOne({userID:userID})
            const user =  await User.findOne({_id:userID})
            res.render('user/wallet',{user,wallet})
        }
        catch(error){
            console.log(error.message)
        }
    }
}

module.exports = walletController