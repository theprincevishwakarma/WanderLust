const { cloudinary } = require("../config/cloudConfig");
const ExpressError = require("../utils/ExpressError");

const {
  listingSchema,
  reviewSchema,
  userSchema,
} = require("../validators/index");

const validator = (schema) => async (req, res, next) => {
  let { error } = schema.validate(req.body);
  if (error) {
    if (req.file) {
      await cloudinary.uploader.destroy(req.file.filename).catch((err) => {
        next(err);
      });
    }
    const errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// Validate Listing Middleware
exports.validateListing = validator(listingSchema);

// Validate Review Middleware
exports.validateReview = validator(reviewSchema);

// Validate User Middleware
exports.validateUser = validator(userSchema);
