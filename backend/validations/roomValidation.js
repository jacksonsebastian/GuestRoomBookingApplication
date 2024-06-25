const Joi = require("joi");

// DRY, KISS Principle Follows

const idRule = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/) // Regex to match MongoDB ObjectId format
  .messages({
    "string.pattern.base": "Invalid Room Id format",
    "any.required": "Room Id is required",
    "string.empty": "Room Id cannot be empty",
    "string.base": "Room Id must be a string",
  });

const nameRule = Joi.string().required().messages({
  "any.required": "Name is required",
  "string.empty": "Name cannot be empty",
  "string.base": "Name must be a string",
});

const floorSizeRule = Joi.number().required().messages({
  "any.required": "Floor size is required",
  "number.base": "Floor size must be a number",
});

const numberOfBedsRule = Joi.number().required().messages({
  "any.required": "Number of beds is required",
  "number.base": "Number of beds must be a number",
});

const amenitiesRule = Joi.array().items(Joi.string()).required().messages({
  "any.required": "Amenities are required",
  "array.base": "Amenities must be an array of strings",
});

const rentAmountRule = Joi.number().required().messages({
  "any.required": "Rent amount is required",
  "number.base": "Rent amount must be a number",
});

const ownerIdRule = Joi.string().required().messages({
  "any.required": "Owner ID is required",
  "string.empty": "Owner ID cannot be empty",
  "string.base": "Owner ID must be a string",
});

const minBookingPeriodRule = Joi.number().required().messages({
  "any.required": "Minimum booking period is required",
  "number.base": "Minimum booking period must be a number",
});

const maxBookingPeriodRule = Joi.number().required().messages({
  "any.required": "Maximum booking period is required",
  "number.base": "Maximum booking period must be a number",
});

// ReUsable Validations
const createRoomsSchema = Joi.object({
  name: nameRule,
  floorSize: floorSizeRule,
  numberOfBeds: numberOfBedsRule,
  amenities: amenitiesRule,
  rentAmount: rentAmountRule,
  minBookingPeriod: minBookingPeriodRule,
  maxBookingPeriod: maxBookingPeriodRule,
});

const updateRoomSchema = Joi.object({
  roomId: idRule,
  name: nameRule.optional(),
  floorSize: floorSizeRule.optional(),
  numberOfBeds: numberOfBedsRule.optional(),
  amenities: amenitiesRule.optional(),
  rentAmount: rentAmountRule.optional(),
  minBookingPeriod: minBookingPeriodRule.optional(),
  maxBookingPeriod: maxBookingPeriodRule.optional(),
});

const createRoomsValidation = Joi.object({
  ownerId: ownerIdRule,
  rooms: Joi.array().items(createRoomsSchema).min(1).required().messages({
    "any.required": "At least one room must be provided",
    "array.base": "Rooms must be an array",
    "array.min": "At least one room must be provided",
  }),
});

const updateRoomsValidation = Joi.object({
  rooms: Joi.array().items(updateRoomSchema).min(1).required().messages({
    "any.required": "At least one room must be provided",
    "array.base": "Rooms must be an array",
    "array.min": "At least one room must be provided",
  }),
});

const roomValidation = {
  create: createRoomsValidation,
  update: updateRoomsValidation,

  getById: Joi.object({
    roomId: idRule,
  }),

  delete: Joi.object({
    roomId: idRule,
  }),
};

module.exports = roomValidation;
