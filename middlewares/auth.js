const isLogin = (req,res,next)=>{
    if(req.session.user === undefined){
        req.flash('alertMessage', `${req.session}`)
        req.flash('alertStatus', 'danger')
        res.redirect('/admin/signin')
    }else{
        next()
    }
}

// module.exports = isLogin;
module.exports = isLogin;