const Joi = require('joi');

const idRule = Joi.string().required().messages({
  'any.required': 'ID is required',
  'string.empty': 'ID cannot be empty',
  'string.base': 'ID must be a string'
});

const nameRule = Joi.string().required().messages({
  'any.required': 'Name is required',
  'string.empty': 'Name cannot be empty',
  'string.base': 'Name must be a string'
});

const floorSizeRule = Joi.number().required().messages({
  'any.required': 'Floor size is required',
  'number.base': 'Floor size must be a number'
});

const numberOfBedsRule = Joi.number().required().messages({
  'any.required': 'Number of beds is required',
  'number.base': 'Number of beds must be a number'
});

const amenitiesRule = Joi.array().items(Joi.string()).required().messages({
  'any.required': 'Amenities are required',
  'array.base': 'Amenities must be an array of strings'
});

const rentAmountRule = Joi.number().required().messages({
  'any.required': 'Rent amount is required',
  'number.base': 'Rent amount must be a number'
});

const ownerIdRule = Joi.string().required().messages({
  'any.required': 'Owner ID is required',
  'string.empty': 'Owner ID cannot be empty',
  'string.base': 'Owner ID must be a string'
});

const roomValidation = {
  create: Joi.object({
    ownerId: ownerIdRule,
    name: nameRule,
    floorSize: floorSizeRule,
    numberOfBeds: numberOfBedsRule,
    amenities: amenitiesRule,
    rentAmount: rentAmountRule
  }),

  update: Joi.object({
    id: idRule,
    name: nameRule.optional(),
    floorSize: floorSizeRule.optional(),
    numberOfBeds: numberOfBedsRule.optional(),
    amenities: amenitiesRule.optional(),
    rentAmount: rentAmountRule.optional()
  }).min(1),

  getById: Joi.object({
    id: idRule
  }),

  delete: Joi.object({
    id: idRule
  })
};

module.exports = roomValidation;
