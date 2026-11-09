const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isNotOwner } = require("../middlewares");

const listingController = require("../controllers/bookings");
const { render } = require("ejs");

router.get(
  "/stays",
  isLoggedIn,
  wrapAsync(listingController.renderAllBookingStays),
);

router
  .route("/stays/:id")
  .get(isLoggedIn, isNotOwner, wrapAsync(listingController.renderBookingPage))
  .post(isLoggedIn, isNotOwner, wrapAsync(listingController.bookListing));

module.exports = router;
