const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

reviewSchema.pre("deleteMany", async function () {
  const reviewIds = await this.model.distinct("_id", this.getFilter());
  if (!reviewIds.length) return;

  await mongoose
    .model("Listing")
    .updateMany(
      { reviews: { $in: reviewIds } },
      { $pull: { reviews: { $in: reviewIds } } },
    );
});

module.exports = mongoose.model("Review", reviewSchema);
