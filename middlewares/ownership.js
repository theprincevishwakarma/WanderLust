const Listing = require("../models/listing");
const Review = require("../models/review");

const ExpressError = require("../utils/ExpressError");

const getListing = async (id) => {
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "StayNest not found!");
  return listing;
};

// check Owner of the listing is req.user
exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await getListing(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the owner of this StayNest!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// check Author of the Review to delete review
exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const blockOwner = (message) => async (req, res, next) => {
  const { id } = req.params;
  const listing = await getListing(id);
  if (req.user && listing.owner.equals(req.user._id)) {
    req.flash("error", message);
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// StayNest owner does'nt have permission to create review on there own StayNest
exports.isListingOwner = blockOwner(
  "Owner have no permission to create review on there own StayNest",
);

exports.isNotOwner = blockOwner("You cannot book your own StayNest!");
