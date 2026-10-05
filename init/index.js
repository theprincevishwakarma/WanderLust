const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");
const { cloudinary } = require("../cloudConfig");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  let listings = await Listing.find({});
  for (let listing of listings) {
    if (listing.image.filename.startsWith("StayNest_Listings/")) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
  }

  await Listing.deleteMany({});
  initData.data = await Promise.all(
    initData.data.map(async (obj) => {
      const response = await geocodingClient
        .forwardGeocode({
          query: obj.location,
          limit: 1,
        })
        .send();

      return {
        ...obj,
        owner: "6abe86968efccb54c5fe76b4",
        geometry: response.body.features[0].geometry,
      };
    }),
  );
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
