const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

module.exports.savereview = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);

    if(listing.owner.equals(req.user._id)){
      req.flash("failure","You cannot write review on your own Listing");
      return res.redirect(`/listings/${listing._id}`);
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req,res)=>{
  let {id, reviewId} = req.params;

  await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});

  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!")
  res.redirect(`/listings/${id}`);
};