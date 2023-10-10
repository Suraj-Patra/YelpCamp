const express = require('express');
const router = express.Router();

/* Local Imports */
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const {
	handleGetAllCampgrounds,
	handleGetOneCampground,
	handleRenderAddCampground,
	handleAddCampground,
	handleRenderEditCampground,
	handleEditCampground,
	handleDeleteCampground,
} = require('../controllers/campgrounds.controller');

// Get Campground :
router.get('/allCamps', catchAsync(handleGetAllCampgrounds));
router.get('/oneCamp/:id', catchAsync(handleGetOneCampground));

// Add Campground :
router
	.route('/newCamp')
	.get(isLoggedIn, handleRenderAddCampground)
	.post(isLoggedIn, validateCampground, catchAsync(handleAddCampground));

// Edit Campground :
router
	.route('/editCamp/:id')
	.get(isLoggedIn, isAuthor, catchAsync(handleRenderEditCampground))
	.put(
		isLoggedIn,
		isAuthor,
		validateCampground,
		catchAsync(handleEditCampground)
	);

// Delete Campground :
router.delete(
	'/deleteCamp/:id',
	isLoggedIn,
	isAuthor,
	catchAsync(handleDeleteCampground)
);

module.exports = router;
