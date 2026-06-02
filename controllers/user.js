const User = require("../models/user.js");

module.exports.getsignup = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.postSignup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newuser = new User({email,username});
        const registereduser = await User.register(newuser,password);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            
            req.flash("success","User Registered Successfully!");
            res.redirect("/listings");
        })
        
    }catch(e){
        req.flash("failure",e.message);
        res.redirect("/signup");
    }
};

module.exports.getlogin = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.postlogin = async (req,res)=>{
    req.flash("success","Welcome Back to WanderLust");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are Logged Out!");
        res.redirect("/listings");
    })
};