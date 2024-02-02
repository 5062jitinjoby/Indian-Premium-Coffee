const adminLogin = (req, res, next) => {
    if (req.session.adminID) {
        next()
    }
    else {
        res.redirect('/admin/login')
    }
}
const adminLogout = (req, res, next) => {
    if (req.session.adminID) {
        res.redirect("/admin/home")
    }
    else {
        next()
    }
}

module.exports = {
    adminLogin,
    adminLogout
}