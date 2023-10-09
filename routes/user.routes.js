const express = require('express');
const passport = require('passport');

const router = express.Router();

const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync.util');
const { storeReturnTo } = require('../middleware');

/* Register */
router.get('/register', (req, res) => {
	res.render('users/register');
});
router.post(
	'/register',
	catchAsync(async (req, res, next) => {
		try {
			const { username, email, password } = req.body;
			const user = new User({ username, email });
			const newUser = await User.register(user, password);
			req.login(newUser, (err) => {
				if (err) return next(err);
				req.flash('success', 'Welcome to Yelp Camp!');
				res.redirect('/campgrounds/allCamps');
			});
		} catch (e) {
			req.flash('error', e.message);
			res.redirect('/users/register');
		}
	})
);

/* Login */
router.get('/login', (req, res) => {
	res.render('users/login');
});
router.post(
	'/login',
	storeReturnTo,
	passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/users/login',
	}),
	(req, res) => {
		req.flash('success', 'Welcome back!');
		const redirectUrl = res.locals.returnTo || '/campgrounds/allCamps';
		res.redirect(redirectUrl);
	}
);

/* Logout */
router.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) return next(err);
		req.flash('success', 'Successfully Logged out!');
		res.redirect('/campgrounds/allCamps');
	});
});

module.exports = router;
