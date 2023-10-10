const express = require('express');
const router = express.Router({ mergeParams: true }); // For using params from app.js

/* Local Imports */
const Campground = require('../models/campground.model');
const Review = require('../models/review.model');
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

// Add review for Campground :
router.post(
	'/',
	isLoggedIn,
	validateReview,
	catchAsync(async (req, res) => {
		const campground = await Campground.findById(req.params.id);
		const review = await Review.create({
			...req.body,
			author: req.user._id,
		});
		campground.reviews.push(review);
		await campground.save();
		req.flash('success', 'Created new review!');
		res.redirect(`/campgrounds/oneCamp/${campground._id}`);
	})
);

// Delete review for Campground :
router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
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
