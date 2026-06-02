const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares.js")

const usercontroller = require("../controllers/user.js")

//signup
router
.route("/signup")
.get(usercontroller.getsignup) // get signup page
.post(wrapAsync(usercontroller.postSignup)); //save details and move to home page

//login
router
.route("/login")
.get(usercontroller.getlogin) //get login page
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect : "/login", failureFlash : true}),usercontroller.postlogin); //authenticate user

//logout
router.get("/logout",usercontroller.logout);

// router.get("/delete",(req,res)=>{

// });

module.exports = router;