const { cloudinary } = require("../cloudConfig");
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const ExpressError = require("../utils/ExpressError");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const search = req.query.search?.trim() || "";
  const category = req.query.category || "";

  let filter = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [
      { title: searchRegex },
      { location: searchRegex },
      { country: searchRegex },
    ];
  }
  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index.ejs", {
    allListings,
    search,
    seoTitle: "Explore Stays & Hotels | StayNest",
    seoDescription:
      "Explore amazing stays, hotels, villas and unique accommodations. Find your perfect stay with StayNest.",
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new", { showSearch: false });
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(
      new ExpressError(404, "StayNest you requested for doesn't exist!"),
    );
  }
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "StayNest you requested for doesn't exist!");
    return next(
      new ExpressError(404, "StayNest you requested for doesn't exist!"),
    );
  }
  const booking = req.user
    ? Boolean(
        await Booking.exists({
          listingId: listing._id,
          userId: req.user._id,
        }),
      )
    : false;

  const plainDescription = listing.description
    ?.replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  res.render("./listings/show", {
    listing,
    booking,
    seoTitle: `${listing.title} in ${listing.location} | StayNest`,

    seoDescription: `${
      plainDescription?.slice(0, 150) ||
      `Discover ${listing.title} at ${listing.location}, ${listing.country}. Book your perfect stay with StayNest.`
    }`,
  });
};

module.exports.createListing = async (req, res) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  const newListing = new Listing(req.body.listing);
  let { url, filename } = req.file;
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();

  req.user.listings += 1;
  await req.user.save();

  req.flash("success", "New StayNest Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "StayNest you requested for doesn't exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/q_40");
  res.render("./listings/edit", {
    listing,
    originalImageUrl,
    showSearch: false,
  });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (listing.location != req.body.listing.location) {
    let response = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
      .send();
    listing.geometry = response.body.features[0].geometry;
  }
  Object.assign(listing, req.body.listing);
  await listing.save();
  if (typeof req.file != "undefined") {
    let { filename: oldFilename } = listing.image;
    let { url, filename } = req.file;
    listing.image = { url, filename };
    await listing.save();
    await cloudinary.uploader.destroy(oldFilename);
  }
  req.flash("success", "StayNest Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  await cloudinary.uploader.destroy(listing.image.filename);

  req.user.listings -= 1;
  await req.user.save();

  req.flash("success", "StayNest Deleted!");
  res.redirect(`/${req.user.username}/listings`);
};
