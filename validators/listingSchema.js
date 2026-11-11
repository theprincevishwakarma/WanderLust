const Joi = require("joi");

exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().required(),
      filename: Joi.string().required(),
    }),
    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic Cities",
        "food",
        "mountains",
        "castles",
        "amazing Pools",
        "camping",
        "farms",
        "arctic",
        "cottage",
        "apartment",
      )
      .required(),
  }).required(),
});
