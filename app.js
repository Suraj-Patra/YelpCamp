if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const path = require('path');
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express();
const PORT = 8000;

/* ---------------------- Local Imports --------------------------- */
const campgroundRouter = require('./routes/campground.routes');
const reviewRouter = require('./routes/review.routes');
const userRouter = require('./routes/user.routes');
const User = require('./models/user.model');

/* ---------------------- Database -------------------------------- */
mongoose
	.connect('mongodb://127.0.0.1:27017/yelp-camp')
	.then((res) => console.log('MongoDB Connected'))
	.catch((err) => console.log('Error connecting MongoDB', err));

/* ---------------------- View Engine ----------------------------- */
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* ---------------------- Middlewares ----------------------------- */
// express :
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
// session & flash :
const sessionConfig = {
	secret: 'thisisasecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true, // Default now
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));
app.use(flash());

// passport :
app.use(passport.initialize());
app.use(passport.session()); // need to use after express.session()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setting locals :
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

/* ------------------------ Routers ------------------------------ */
app.get('/', (req, res) => {
	res.render('home');
});
app.use('/users', userRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

// 404 Not Found :
app.all('*', (req, res, next) => {
	next(new ExpressError('Page Not Found', 404));
});
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong!';
	res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => console.log(`Server running at : ${PORT}`));
