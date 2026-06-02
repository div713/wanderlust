const express = require("express");

const router = express.Router({mergeParams : true});

const wrapAsync = require("../utils/wrapAsync.js");

const {validateReview,isLoggedin,isAuthor} = require("../middlewares.js");

const reviewcontroller = require("../controllers/reviews.js")

//reviews post route
router.post("/",isLoggedin,validateReview,wrapAsync(reviewcontroller.savereview));

//review delete route
router.delete("/:reviewId",isLoggedin,isAuthor,wrapAsync(reviewcontroller.destroyReview));

module.exports = router;