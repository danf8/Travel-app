// require dependencies
const express = require('express');
const mongoose = require('mongoose');
const Location = require('./models/location');
const data = require('./data')

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

//mount routes
//INDUCES

//seed data
app.get('/locations/seed', (req, res) => {
    Location.deleteMany({}, (err, results) => {
        Location.create(data, (err, locations) => {
            res.redirect('/locations');
        });
    });
});

//Index
app.get('/locations', (req, res) => {
    Location.find({}, (err, allLocations) => {
        res.render('index.ejs', {
            locations: allLocations,
        });
    });
});

//New

//Delete

//Update

//Create
app.post('/locations', (req, res) => {
    Location.create(req.body, (err, createdLocation) => {
        res.send(createdLocation);
    });
});

//Edit

// Show- GET location/:id
app.get('/locations/:id', (req, res) => {
    Location.findById(req.params.id, (err, foundLocation) => {
        res.render('show.ejs', {
            location: foundLocation,
        });
    });
});

//tell the application to listen on a dedicated port.
app.listen(PORT, () => {
    console.log(`Express is listening on port: ${PORT}`);
})