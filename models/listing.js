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
      "https://www.vecteezy.com/photo/12168187-beautiful-sunset-on-the-beach-with-palm-tree-for-travel-and-vacation",
    set: (v) =>
      v === ""
        ? "https://www.vecteezy.com/photo/12168187-beautiful-sunset-on-the-beach-with-palm-tree-for-travel-and-vacation"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
