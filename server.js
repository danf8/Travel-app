// require dependencies
const express = require('express');
const mongoose = require('mongoose');
const Location = require('./models/location');
const data = require('./data');
const methodOverride = require('method-override');
const locationsRouter = require('./controllers/locations');
const usersRouter = require('./controllers/users');
const session = require('express-session');

// initialize the application
const app = express();

//config application settings
require('dotenv').config()
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

//establish connection to mongodb
mongoose.set('strictQuery', true);
mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});

db.on('error', (err) => {
    console.log(`An error occured with MongoDB: ${err.message}`);
});

//mount middleware

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
//dev purposes
// app.use((req, res, next) => {
//     console.log(req.session)
//     next();
// });

app.use((req, res, next) => {
    if(req.session.userId) {
        res.locals.user = req.session.userId;
    } else {
        res.locals.user = null;
    }
    next();
})

//authenitcatin
function authenticatedUser(req, res , next) {
    if(!req.session.userId){
        return res.redirect('/');
    }
    next();
};

//mount routes
//INDUCES
app.get('/', (req, res) => res.render('homepage.ejs'));

app.use(usersRouter);
app.use(authenticatedUser, locationsRouter);

//tell the application to listen on a dedicated port.
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`);
});