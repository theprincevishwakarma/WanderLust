const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    listingId: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    guestId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    totalGuests: {
      type: Number,
      required: true,
      min: 1,
    },

    idealcheckIn: {
      type: Date,
      required: true,
    },

    idealcheckOut: {
      type: Date,
      required: true,
    },

    checkIn: {
      type: Date,
      required: true,
    },

    checkOut: {
      type: Date,
      required: true,
    },

    totalNights: {
      type: Number,
      required: true,
      min: 1,
    },

    // amount in paise(₹1 = 100 paise)

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    hostAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    platformFee: {
      type: Number,
      required: true,
      min: 0,
    },

    rzpOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    paymentId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
