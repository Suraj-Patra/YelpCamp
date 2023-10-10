const { Module } = require('module');
const mongoose = require('mongoose');
const { campgroundSchema } = require('../JoiSchemas');
const Schema = mongoose.Schema;

const Review = require('./review.model');

const CampgroundSchema = new Schema({
	title: String,
	image: String,
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review',
		},
	],
});

// After deleting campground, all reviews associated with it will be removed.
// "findOneAndDelete" will be only trigerred, if the campground is deleted by "findByIdAndDelete"
CampgroundSchema.post('findOneAndDelete', async function (camp) {
	if (camp) {
		await Review.deleteMany({ _id: { $in: camp.reviews } });
	}
});

const Campground = new mongoose.model('Campground', CampgroundSchema);

module.exports = Campground;
