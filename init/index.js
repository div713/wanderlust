require("dotenv").config({path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const db_url = process.env.ATLASDBURL;
// console.log(db_url);

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

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj,owner: '6a1f07a3887662b7d1a61e89'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();