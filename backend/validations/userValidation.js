const Joi = require("joi");

// DRY, KISS Principle Follows

const nameRule = Joi.string().required().messages({
  "any.required": "Name is required",
  "string.base": "Name must be a string",
  "string.empty": "Name cannot be empty",
});

const emailRule = Joi.string().email().required().messages({
  "any.required": "Email is required",
  "string.email": "Email must be a valid email address",
  "string.empty": "Email cannot be empty",
});

const passwordRule = Joi.string()
  .min(6)
  .pattern(new RegExp("^[a-zA-Z0-9@]{3,30}$"))
  .messages({
    "string.pattern.base":
      'Password must contain only letters, numbers, or "@" and be between 3 and 30 characters long.',
    "string.min": "Password must be at least 6 characters long",
    "any.required": "Password is required",
    "string.empty": "Password cannot be empty",
  });

const phoneRule = Joi.string()
  .length(10)
  .pattern(/[6-9]{1}[0-9]{9}/)
  .required()
  .messages({
    "any.required": "Phone number is required.",
    "string.empty": "Phone number cannot be empty.",
    "string.length": "Phone number must be exactly 10 digits long.",
    "string.pattern.base": "Phone number is invalid.",
  });

const roleRule = Joi.string().valid("admin", "user").required().messages({
  "any.required": "Role is required",
  "string.empty": "Role cannot be empty",
  "any.only": "Role must be either 'admin' or 'user'",
});

// ReUsable Validations
const userValidation = {
  register: Joi.object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    phone: phoneRule,
  }),
  create: Joi.object({
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    phone: phoneRule,
    role: roleRule,
  }),
  login: Joi.object({
    email: emailRule.optional(),
    phone: phoneRule.optional(),
    password: passwordRule,
  })
    .or("email", "phone")
    .messages({
      "object.missing": "Email or Phone is required to login",
    }),
  update: Joi.object({
    name: Joi.string().messages({
      "string.base": "Name must be a string",
    }),
    email: Joi.string().email().messages({
      "string.email": "Email must be a valid email address",
    }),
    phone: Joi.string()
      .length(10)
      .pattern(/[6-9]{1}[0-9]{9}/)
      .required()
      .messages({
        "string.length": "Phone number must be exactly 10 digits long.",
        "string.pattern.base": "Phone number is invalid.",
      }),
  }).min(1),
};

module.exports = userValidation;
