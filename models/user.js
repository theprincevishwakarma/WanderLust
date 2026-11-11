const { cloudinary } = require("../config/cloudConfig");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listing = require("./listing");
const Review = require("./review");

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  name: {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNo: {
    type: Number,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  listings: {
    type: Number,
    default: 0,
  },
  bookings: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.post("findOneAndDelete", async (user) => {
  if (!user) return;

  const listings = await Listing.find({ owner: user._id });
  for (const listing of listings) {
    await Listing.findByIdAndDelete(listing._id);
    await cloudinary.uploader.destroy(listing.image.filename);
  }
  await Review.deleteMany({ author: user._id });
});

userSchema.plugin(passportLocalMongoose.default);

module.exports = mongoose.model("User", userSchema);
