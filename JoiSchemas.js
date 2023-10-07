const Joi = require('joi');

// Defining Schema for validating with Joi :
const campgroundSchema = Joi.object({
	title: Joi.string().required(),
	price: Joi.number().min(0).required(),
	image: Joi.string().required(),
	description: Joi.string().required(),
	location: Joi.string().required(),
});

module.exports = {
	campgroundSchema,
};
