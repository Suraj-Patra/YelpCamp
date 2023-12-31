/* Local Imports */
const Campground = require('../models/campground.model');
const Review = require('../models/review.model');

const handleAddReview = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = await Review.create({
		...req.body,
		author: req.user._id,
	});
	campground.reviews.push(review);
	await campground.save();
	req.flash('success', 'Created new review!');
	res.redirect(`/campgrounds/oneCamp/${campground._id}`);
};
const handleDeleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	// remove an element from an array in mongo
	await Campground.findByIdAndUpdate(id, {
		$pull: { reviews: reviewId },
	});
	await Review.findByIdAndDelete(reviewId);
	req.flash('success', 'Successfully deleted review!');
	res.redirect(`/campgrounds/oneCamp/${id}`);
};

module.exports = {
	handleAddReview,
	handleDeleteReview,
};
