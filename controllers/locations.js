const express = require('express');
const router = express.Router();
const data = require('../data');
const Location = require('../models/location');

require('dotenv').config();
const API_KEY = process.env.API_KEY
//seed data
router.get('/locations/seed', (req, res) => {
    Location.deleteMany({}, (err, results) => {
        Location.create(data, (err, locations) => {
            res.redirect('/locations');
        });
    });
});

//Index
router.get('/locations', (req, res) => {
    Location.find({}, (err, allLocations) => {
        res.render('index.ejs', {
            locations: allLocations,
        })
    });
});

//New
router.get('/locations/new', (req, res) => {
    res.render('new.ejs');
});

//Delete -- get locations/:id
router.delete('/locations/:id', (req, res) => {
    Location.findByIdAndDelete(req.params.id, (err, deletedLocation) => {
        res.redirect('/locations');
    });
});

//Update
router.put('/locations/:id', (req, res) => {
    Location.findByIdAndUpdate(req.params.id, req.body, (err, updatedLocation) => {
        res.redirect('/locations');
    });
});

//Create
router.post('/locations', (req, res) => {
    Location.create(req.body, (err, createdLocation) => {
        res.redirect('/locations');
    });
});

//Edit --GET locations/:id/edit
router.get('/locations/:id/edit', (req, res) => {
    Location.findById(req.params.id, (err, foundLocation) => {
        res.render('edit.ejs', {
            location: foundLocation,
        });
    });
});

// Show- GET location/:id
router.get('/locations/:id', (req, res) => {
    Location.findById(req.params.id, (err, foundLocation) => {
        fetch("https://api.openweathermap.org/data/2.5/weather?q="+foundLocation.name+"&units=imperial&appID="+API_KEY)
        .then((response) => response.json())
        .then((data) =>  res.render('show.ejs', {
            location: foundLocation,
            data: data
        }));
    });
});

module.exports = router;