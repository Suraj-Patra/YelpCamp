const express = require('express');
const router = express.Router({ mergeParams: true }); // For using params from app.js

/* Local Imports */
const Campground = require('../models/campground.model');
const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const ExpressError = require('../utils/ExpressError.util'); // For customized errors
const { reviewSchema } = require('../JoiSchemas');

// Middlewares for validation :
function validateReview(req, res, next) {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(',');
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
}

// Add review for Campground :
router.post(
	'/',
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = await Review.create(req.body);
		campground.reviews.push(review);
		await campground.save();
		req.flash('success', 'Created new review!');
		res.redirect(`/campgrounds/oneCamp/${campground._id}`);
	})
);

// Delete review for Campground :
router.delete(
	'/:reviewId',
	catchAsync(async (req, res) => {
		const { id, reviewId } = req.params;
		// remove an element from an array in mongo
		await Campground.findByIdAndUpdate(id, {
			$pull: { reviews: reviewId },
		});
		await Review.findByIdAndDelete(reviewId);
		req.flash('success', 'Successfully deleted review!');
		res.redirect(`/campgrounds/oneCamp/${id}`);
	})
);

module.exports = router;
