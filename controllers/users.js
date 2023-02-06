const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

require('dotenv').config();
const API_KEY = process.env.API_KEY

//sign up users
router.get('/signup', (req, res) => {
    res.render('signup.ejs' ,{error: null});
});

//login users 
router.get('/login', (req, res) => {
    res.render('login.ejs', {error: null});
});

//logtout users 
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});

//get saved locations page
router.get('/locations/saved', (req, res) => {
    User.find({_id: req.session.userId}, (err, savedLocation) => {
        if ( !req.session.userId ) {
            return res.redirect('/');
        }
        res.render('users/saved.ejs', {
            user: savedLocation,
        });
    });
});

//update saved list --put
router.put('/locations/update/:id', (req, res) => {
    User.findOneAndUpdate({_id: req.session.userId}, {$pull: {savedLocations: {_id: req.params.id}}}, {new: true, useFindAndModify: false}, (err, updatedSave) => {
        res.redirect('/locations/saved');
    });
});

//create saved location
router.post('/locations/saved', (req, res) => {
    User.findOneAndUpdate({_id: req.session.userId}, {$addToSet: {savedLocations: req.body}}, (err, savedLocation) => {
        if ( err ) {
            console.log(err);
        }
        res.redirect('/locations/saved');
    });
});

// create new travel plan
router.post('/locations/saved/plans/:id', (req, res) => {
    User.findById(req.session.userId,(err, user) => {
        user.savedLocations[req.body.locationIndex].travelPlan.push(req.body.travelPlan);
        user.savedLocations[req.body.locationIndex].travelDate.push(req.body.travelDate);
        user.save((err) => {
            res.redirect(`/locations/saved/${req.body.locationIndex}`)
        });
    });
});

//handle form submission --CREATE
router.post('/signup', (req, res) => {
    let error = null;
    if ( req.body.password !== req.body.confirmPass) {
        error = 'passwords must match';
        return res.render('signup.ejs', {error});
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const hashedConfirmPass = bcrypt.hashSync(req.body.confirmPass, 10);
    req.body.confirmPass = hashedConfirmPass;
    req.body.password = hashedPassword;
    User.create(req.body, (err, newUser) => {
        if(err) {
            error= 'email taken';
            return res.render('signup.ejs', {error})
        }
        req.session.userId = newUser._id;
        res.redirect('/locations');
    });
});

// handle form submission -- create
router.post('/login', (req, res) => {
    const error = 'Incorrect Login Information.'
    User.findOne({email: req.body.email}, (err, userFound) => {
        if ( !userFound ) {
            return res.render('login.ejs', {error});
        }
        const confirmedPass = bcrypt.compareSync(req.body.password, userFound.password);
        if ( !confirmedPass ) {
            return res.render('login.ejs', {error});
        }
        req.session.userId = userFound._id;
        res.redirect('/locations');
    });
});

//show -- get user locations
router.get('/locations/saved/:indexOf', (req, res) => {
    User.findById({_id: req.session.userId}, (err, savedLocation) => {
        savedLocation = savedLocation.savedLocations[req.params.indexOf];
        fetch("https://api.openweathermap.org/data/2.5/weather?q="+savedLocation.locationsName+"&units=imperial&appID="+API_KEY)
        .then((response) => response.json())
        .then((data) => 
        res.render('users/plans.ejs', {
            user: savedLocation,
            locationIndex: req.params.indexOf,
            data: data
        }));
    });
});

module.exports = router