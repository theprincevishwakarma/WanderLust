const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { listingSchema } = require("../schema");

const { isLoggedIn } = require("../middleware");

// Validate Listing Middleware
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index", { allListings });
  }),
);

// New Route
router.get(
  "/new",
  isLoggedIn("You must be logged in to create StayNest!"),
  (req, res) => {
    res.render("./listings/new");
  },
);

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "StayNest you requested for doesn't exist!");
      res.redirect("/listings");
    } else {
      res.render("./listings/show", { listing });
    }
  }),
);

// Create Route
router.post(
  "/",
  isLoggedIn("You must be logged in to create StayNest!"),
  validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New StayNest Created!");
    res.redirect("/listings");
  }),
);

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn("You must be logged in to edit StayNest!"),
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "StayNest you requested for doesn't exist!");
      res.redirect("/listings");
    } else {
      res.render("./listings/edit", { listing });
    }
  }),
);

// Update Route
router.put(
  "/:id",
  isLoggedIn("You must be logged in to edit StayNest!"),
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "StayNest Updated!");
    res.redirect(`/listings/${id}`);
  }),
);

// Delete Route
router.delete(
  "/:id",
  isLoggedIn("You must be logged in to delete StayNest!"),
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "StayNest Deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
