const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const listingController = require("../controllers/bookings");

const { isLoggedIn, isNotOwner } = require("../middlewares/index");

router.get("/", isLoggedIn, wrapAsync(listingController.renderAllBookingStays));

router.get(
  "/:id",
  isLoggedIn,
  isNotOwner,
  wrapAsync(listingController.renderBookingPage),
);
// .post(isLoggedIn, isNotOwner, wrapAsync(listingController.bookListing));

module.exports = router;
