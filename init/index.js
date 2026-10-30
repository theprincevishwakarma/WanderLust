require("dotenv").config({
  path: "../.env",
});

const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const Review = require("../models/review");
const User = require("../models/user");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLUSDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  // const userId = "6ac9b50c2b95698c33a39f56";
  const userId = "6ac9bd199894bd65cc0f3f46";

  let listings = await Listing.find({});
  for (let listing of listings) {
    if (listing.image.filename.startsWith("StayNest_Listings/")) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
  }

  await Listing.deleteMany({});
  await Review.deleteMany({});

  const user = await User.findById(userId);
  user.listings = 0;
  user.bookings = 0;

  initData.data = await Promise.all(
    initData.data.map(async (obj) => {
      const response = await geocodingClient
        .forwardGeocode({
          query: obj.location,
          limit: 1,
        })
        .send();

      user.listings += 1;

      return {
        ...obj,
        category: "demo listings",
        owner: userId,
        geometry: response.body.features[0].geometry,
      };
    }),
  );
  await Listing.insertMany(initData.data);

  await user.save();

  console.log("data was initialized");
};

initDB();
