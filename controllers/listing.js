const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.getnew = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.postnew = async (req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.getlisting = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews", populate:{path : "author"}}).populate("owner");
    if(!listing){
        req.flash("failure","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs",{listing});
};

module.exports.getedit = async (req,res)=>{
    let {id} = req.params;

    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("failure","Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let orgurl = listing.image.url;
    orgurl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", {listing,orgurl});

};

module.exports.putedit = async (req,res)=>{
    let {id} = req.params;
    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!")

    res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}