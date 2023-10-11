const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} must not include HTML!',
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHTML(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error('string.escapeHTML', { value });
				return clean;
			},
		},
	},
});

const Joi = BaseJoi.extend(extension);

// Defining Schema for validating with Joi :
const campgroundSchema = Joi.object({
	title: Joi.string().required().escapeHTML(),
	price: Joi.number().min(0).required(),
	// image: Joi.string().required(),
	description: Joi.string().required().escapeHTML(),
	location: Joi.string().required().escapeHTML(),
	deleteImages: Joi.array(),
});
const reviewSchema = Joi.object({
	body: Joi.string().required().escapeHTML(),
	rating: Joi.number().required().min(1).max(5),
});

module.exports = {
	campgroundSchema,
	reviewSchema,
};
