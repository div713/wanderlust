const express = require("express");

const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const {isOwner,isLoggedin,validateListing} = require("../middlewares.js");

const listingcontroller = require("../controllers/listing.js");

const multer  = require('multer');
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingcontroller.index)) //index
.post(isLoggedin ,
upload.single('listing[image]'),
wrapAsync(listingcontroller.postnew)); //new post

//new route
router.get("/new",isLoggedin, listingcontroller.getnew);
//mylisting
router.get("/mylistings", isLoggedin,wrapAsync(listingcontroller.mylisting));

router
.route("/:id")
.get( wrapAsync(listingcontroller.getlisting)) //show route
.put(isLoggedin,isOwner,upload.single('listing[image]'), wrapAsync(listingcontroller.putedit)) //put edit
.delete(isLoggedin,isOwner,wrapAsync(listingcontroller.destroylisting)); // delete listing

// validateListing,
//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingcontroller.getedit));



module.exports = router;