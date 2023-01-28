const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

// induces

//sign up users
//provides signup form 
router.get('/signup', (req, res) => {
    res.render('signup.ejs' ,{error: null});
});

//handle form submission
router.post('/signup', (req, res) => {
    let error = null;
    if(req.body.password !== req.body.confirmPass){
        error = 'passwords must match'
        return res.render('signup.ejs', {error})
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    User.create(req.body, (err, newUser) => {
        req.session.userId = newUser._id;
        res.redirect('/locations');
    });
});

//login users
router.get('/login', (req, res) => {
    res.render('login.ejs', {error: null});
});

// handle form submission
router.post('/login', (req, res) => {
    //1 look up user using email
    const error = 'Incorrect Login Information.'
    User.findOne({email: req.body.email}, (err, userFound) => {
        //1.1 if user exist compare password for match
        //1.2 if user does not exist we redirect to login pg
        if(!userFound) {
            return res.render('login.ejs', {error});
        }
        const confirmedPass = bcrypt.compareSync(req.body.password, userFound.password)
        // 2. if user exist we use bcyrpt to compare password. plain text ps to hashed/salted
        // 2.1 if password match we redirect to location page
        if(!confirmedPass) {
            //2.2 if password does not match redireect to login page
            return res.render('login.ejs', {error});
        }
        //create a new session for authenitcated user, they logged on
        req.session.userId = userFound._id;
        res.redirect('/locations');
    });

});

//logtout users
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        res.redirect('/login');
    });
});



module.exports = router