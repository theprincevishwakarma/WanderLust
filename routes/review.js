const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const reviewController = require("../controllers/reviews");

const {
  isLoggedIn,
  validateReview,
  isReviewAuthor,
  isListingOwner,
} = require("../middlewares/index");

router.post(
  "/",
  isLoggedIn,
  isListingOwner,
  validateReview,
  wrapAsync(reviewController.createReview),
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);

module.exports = router;
