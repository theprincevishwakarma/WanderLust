const Listing = require("../models/listing");

module.exports.renderBookingPage = async (req, res) => {
  //   res.send("booking pending");
  const listing = await Listing.findById(req.params.id);
  res.render("./bookings/index", { listing });
};
