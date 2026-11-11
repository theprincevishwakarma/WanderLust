const Joi = require("joi");

exports.userSchema = Joi.object({
  user: Joi.object({
    username: Joi.string()
      .trim()
      .min(3)
      .max(20)
      .pattern(/^[a-zA-Z0-9](?:[a-zA-Z0-9_]|[.](?![.]))*[a-zA-Z0-9_]$/)
      .required()
      .messages({
        "string.pattern.base":
          "Username must contain only letters, numbers, underscores or periods, with no consecutive periods.",
      }),
    password: Joi.string().required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .trim()
      .lowercase()
      .max(254)
      .required()
      .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email address is required.",
        "string.max": "Email cannot exceed 254 characters.",
      }),
    name: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }).required(),
    phoneNo: Joi.number().required(),
    location: Joi.string().required(),
  }).required(),
});
