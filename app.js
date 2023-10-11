if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo'); // For storing session data
const flash = require('connect-flash');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize'); // For restricting users to put any malicious queries
const helmet = require('helmet'); // For security

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------------------- Local Imports --------------------------- */
const campgroundRouter = require('./routes/campground.routes');
const reviewRouter = require('./routes/review.routes');
const userRouter = require('./routes/user.routes');
const User = require('./models/user.model');
const ExpressError = require('./utils/ExpressError.util');

/* ---------------------- Database -------------------------------- */

// For connecting to MongoDB Atlas :
// const dbUrl = ;
const dbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
mongoose
	.connect(dbUrl)
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
const secret = process.env.SECRET || 'thisisasecret';
const store = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60, // In seconds
	crypto: {
		secret,
	},
});
store.on('error', (e) => {
	console.log('SESSION STORE ERROR', e);
});
const sessionConfig = {
	store,
	name: 'session', // Changing the default name
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true, // Default now
		// secure: true,	// Works only with 'https'.
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

// helmet Configuration :
app.use(helmet());
const scriptSrcUrls = [
	'https://stackpath.bootstrapcdn.com/',
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	'https://kit.fontawesome.com/',
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net/',
	'https://res.cloudinary.com/dv5vm4sqh/',
];
const styleSrcUrls = [
	'https://kit-free.fontawesome.com/',
	'https://stackpath.bootstrapcdn.com/',
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	'https://fonts.googleapis.com/',
	'https://use.fontawesome.com/',
	'https://cdn.jsdelivr.net/',
	'https://res.cloudinary.com/dv5vm4sqh/',
];
const connectSrcUrls = [
	'https://*.tiles.mapbox.com',
	'https://api.mapbox.com',
	'https://events.mapbox.com',
	'https://res.cloudinary.com/dv5vm4sqh/',
];
const fontSrcUrls = ['https://res.cloudinary.com/dv5vm4sqh/'];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				'https://res.cloudinary.com/dl5dlqqco/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				'https://images.unsplash.com/',
			],
			fontSrc: ["'self'", ...fontSrcUrls],
			mediaSrc: ['https://res.cloudinary.com/dl5dlqqco/'],
			childSrc: ['blob:'],
		},
	})
);

// Mongo sanitize :
app.use(
	mongoSanitize({
		replaceWith: '_',
	})
); // For restricting users to put any malicious queries

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

/* 
	Skipped the map part for pricing issues, and continuing from the "Clean styling part"
*/
