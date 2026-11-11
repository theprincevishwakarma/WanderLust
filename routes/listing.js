const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

const listingController = require("../controllers/listings");

const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middlewares/index");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing),
  );

router.get("/new", isLoggedIn, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
