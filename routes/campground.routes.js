const express = require('express');
const router = express.Router();
const multer = require('multer');

/* Local Imports */
const catchAsync = require('../utils/catchAsync.util'); // For catching asynchronous errors
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
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
	.post(
		isLoggedIn,
		upload.array('image'),
		validateCampground,
		catchAsync(handleAddCampground)
	);

// Edit Campground :
router
	.route('/editCamp/:id')
	.get(isLoggedIn, isAuthor, catchAsync(handleRenderEditCampground))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array('image'),
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
