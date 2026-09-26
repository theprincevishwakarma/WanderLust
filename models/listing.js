const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://res.cloudinary.com/frtasp0i/image/upload/v1789908620/listing_default_img.jpg",
    set: (v) =>
      v === ""
        ? "https://res.cloudinary.com/frtasp0i/image/upload/v1789908620/listing_default_img.jpg"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
