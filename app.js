if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/reviews.js");
const userrouter = require("./routes/user.js")

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");

const db_url = process.env.ATLASDBURL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

console.log(MongoStore);

const store = MongoStore.create({ 
  mongoUrl: db_url,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter : 24*3600
})

store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires : Date.now() + 1000*60*60*24*3,
    maxAge : 1000*60*60*24*3,
    httpOnly : true
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.curUser = req.user;
  next();
})

app.use("/listings", listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);

app.get("/about", (req, res) => {
  res.render("extras/about.ejs");
});

app.get("/privacy",(req,res)=>{
  res.render("extras/privacy.ejs");
})

app.get("/terms",(req,res)=>{
  res.render("extras/terms.ejs");
})

app.get("/contact", (req, res) => {
    res.render("extras/contact.ejs");
});

app.get("*", (req,res,next)=>{
  next(new ExpressError(404, "Page Not Found"));
})

app.use((err,req,res,next)=>{
  console.log(err);
  let {status=500, message="something went wrong"} = err;
  res.status(status).render("listings/error.ejs",{message});
})

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});