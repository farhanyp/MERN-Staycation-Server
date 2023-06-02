const isLogin = (req,res,next)=>{
    if(req.session.user === undefined){
        req.flash('alertMessage', `${req.session.user}`)
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/signin')
    }else{
        next()
    }
}

// module.exports = isLogin;
module.exports = isLogin;