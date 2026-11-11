const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isNotOwner } = require("../middlewares");

const listingController = require("../controllers/bookings");
const { render } = require("ejs");

router.get("/", isLoggedIn, wrapAsync(listingController.renderAllBookingStays));

router.get("/:id", isNotOwner, wrapAsync(listingController.renderBookingPage));
// .post(isLoggedIn, isNotOwner, wrapAsync(listingController.bookListing));

module.exports = router;
