const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");

const { isLoggedIn, isNotOwner } = require("../middleware");

const listingController = require("../controllers/bookings");

router.get("/", isLoggedIn, isNotOwner, listingController.renderBookingPage);

module.exports = router;
