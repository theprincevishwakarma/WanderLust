const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Review = require("../models/review");
const Listing = require("../models/listing");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
  isListingOwner,
} = require("../middleware");

// Reviews
// Post Review Route
router.post(
  "/",
  isLoggedIn("You ain't logged in!"),
  isListingOwner,
  validateReview,
  wrapAsync(async (req, res, next) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${req.params.id}`);
  }),
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn("You ain't logged in!"),
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;
