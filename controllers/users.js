const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

//need user dates and notes in shcema
// need add notes link on save page
//need add new user notes page
//need show user notes page



// induces

//sign up users
//provides signup form -index
router.get('/signup', (req, res) => {
    res.render('signup.ejs' ,{error: null});
});

//login users -index
router.get('/login', (req, res) => {
    res.render('login.ejs', {error: null});
});

//logtout users -index
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});

//Get saved locations page
router.get('/locations/saved', (req, res) => {
    User.find({_id: req.session.userId}, (err, savedLocation) => {
        if(!req.session.userId) {
         return res.redirect('/');
        }
        res.render('saved.ejs', {
            user: savedLocation
        });
    });
});

//update user locations array
router.put('/locations/update/:id', (req, res) => {
    User.findOneAndUpdate({_id: req.session.userId}, {$pull: {locationsName: req.body.locationsName, locationsId: req.body.locationsId}}, (err, updatedSave) => {
        res.redirect('/locations/saved')
    })
})

//create new saved location
router.post('/locations/saved', (req, res) => {
    User.findOneAndUpdate({_id: req.session.userId}, {$addToSet: {locationsName: req.body.locations, locationsId: req.body.locationsId}}, (err, savedLocation) => {
        if(err){
            console.log(err);
        }
        res.redirect('/locations/saved');
    })
});

//handle form submission --CREATE
router.post('/signup', (req, res) => {
    let error = null;
    if(req.body.password !== req.body.confirmPass){
        error = 'passwords must match';
        return res.render('signup.ejs', {error});
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const hashedConfirmPass = bcrypt.hashSync(req.body.confirmPass, 10);
    req.body.confirmPass = hashedConfirmPass;
    req.body.password = hashedPassword;
    User.create(req.body, (err, newUser) => {
        req.session.userId = newUser._id;
        res.redirect('/locations');
    });
});


// handle form submission -- create
router.post('/login', (req, res) => {
    const error = 'Incorrect Login Information.'
    User.findOne({email: req.body.email}, (err, userFound) => {
        if(!userFound) {
            return res.render('login.ejs', {error});
        }
        const confirmedPass = bcrypt.compareSync(req.body.password, userFound.password)
        if(!confirmedPass) {
            return res.render('login.ejs', {error});
        }
        req.session.userId = userFound._id;
        res.redirect('/locations');
    });

});





module.exports = router