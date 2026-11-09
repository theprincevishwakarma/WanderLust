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

module.exports.bookListing = async (req, res) => {
  let { id } = req.params;
  let { checkIn, checkOut, guests } = req.body.booking;
  const listing = await Listing.findById(id);
  const totalNights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24),
  );
  const tax = 18;
  const OneNightOnePersonPrice = listing.price + listing.price * (tax / 100);
  const totalPrice =
    OneNightOnePersonPrice * (guests > 2 ? guests - 1 : 1) * totalNights;
  res.redirect(`/book/stays/${id}`);

  // let { id } = req.params;
  // const booking = new Booking({
  //   userId: req.user._id,
  //   listingId: id,
  //   ...req.body.booking,
  //   status: "confirmed",
  // });
  // req.user.bookings += 1;

  // await booking.save();
  // await req.user.save();
  // res.redirect(`/${req.user.username}`);
};

module.exports.renderAllBookingStays = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate(
    "listingId",
  );
  if (bookings.length != 0) {
    return res.render("./bookings/show", { bookings });
  }
  req.flash("success", "Reserve Some Stays!");
  res.redirect("/listings");
};
