const Joi = require("joi");

const userValidation = {
  register: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Name is required",
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
    phone: Joi.alternatives()
      .try(
        Joi.number().strict().required(),
        Joi.string().required().regex(/^\d+$/)
      )
      .messages({
        "any.required": "Phone number is required",
        "alternatives.match": "Phone number must be a number",
        "string.empty": "Phone number cannot be empty",
        "string.pattern.base": "Phone number must contain only digits",
      }),
  }),
  login: Joi.object({
    email: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.empty": "Email cannot be empty",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
    }),
  }),

  update: Joi.object({
    name: Joi.string().messages({
      "string.base": "Name must be a string",
    }),
    email: Joi.string().email().messages({
      "string.email": "Email must be a valid email address",
    }),
    phone: Joi.number().strict().messages({
      "number.base": "Phone number must be a number",
    }),
  }).min(1),
};

module.exports = userValidation;
