const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.renderBookingPage = async (req, res) => {
  //   res.send("booking pending");
  const listing = await Listing.findById(req.params.id);
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/q_40");
  res.render("./bookings/index", {
    listing,
    originalImageUrl,
    showSearch: false,
  });
};

module.exports.renderAllBookingStays = async (req, res) => {
  const bookings = await Booking.find({ guestId: req.user._id }).populate(
    "listingId",
  );
  if (bookings.length != 0) {
    return res.render("./bookings/show", { bookings });
  }
  req.flash("success", "Reserve Some Stays!");
  res.redirect("/listings");
};
