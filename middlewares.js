const Listing = require("./models/listing");
const Review = require("./models/reviews")
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const {reviewSchema} = require("./schema.js");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        if(req.method === "GET"){
            req.session.redirecturl = req.originalUrl;
        }
        req.flash("failure","Please Log In first");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    console.log(req.session);
    if(req.session.redirecturl){
        res.locals.redirectUrl = req.session.redirecturl;
        delete req.session.redirecturl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curUser._id)){
        req.flash("failure","You are not the Owner of this Listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
      let ermsg = error.details.map((el)=> el.message).join(",");
      console.log(ermsg);
      throw new ExpressError(400, ermsg);  
    }
    else{
      next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
      let ermsg = error.details.map((el)=> el.message).join(",");
      console.log(ermsg);
      throw new ExpressError(400, ermsg);  
    }
    else{
      next();
    }
}

module.exports.isAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curUser._id)){
        req.flash("failure","You did not write this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}