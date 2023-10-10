const express = require('express');
const passport = require('passport');

const router = express.Router();

/* Local Imports */
const catchAsync = require('../utils/catchAsync.util');
const { storeReturnTo } = require('../middleware');
const {
	handleRenderUserRegister,
	handleUserRegister,
	handleRenderUserLogin,
	handleUserLogin,
	handleUserLogout,
} = require('../controllers/users.controller');

/* Register */
router
	.route('/register')
	.get(handleRenderUserRegister)
	.post(catchAsync(handleUserRegister));

/* Login */
router
	.route('/login')
	.get(handleRenderUserLogin)
	.post(
		storeReturnTo,
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/users/login',
		}),
		handleUserLogin
	);

/* Logout */
router.get('/logout', handleUserLogout);

module.exports = router;
