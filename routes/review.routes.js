const express = require('express');
const router = express.Router({ mergeParams: true }); // For using params from app.js

/* Local Imports */
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const {
	handleAddReview,
	handleDeleteReview,
} = require('../controllers/reviews.controller');

// Add review for Campground :
router.post('/', isLoggedIn, validateReview, catchAsync(handleAddReview));

// Delete review for Campground :
router.delete(
	'/:reviewId',
	isLoggedIn,
	isReviewAuthor,
	catchAsync(handleDeleteReview)
);

module.exports = router;
