const path = require('path');
const express = require('express');

const app = express();
const PORT = 8000;

/* View Engine */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/* Middlewares */
app.use(express.json());
app.use(express.urlencoded({extended: false}));



/* Routers */
app.get('/', (req, res) => {
    res.render('home');
})



app.listen(PORT, () => console.log(`Server running at : ${PORT}`));