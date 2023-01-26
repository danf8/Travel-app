const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');



//provides signup form 
router.get('/signup', (req, res) => {
    res.render('signup.ejs');
})

//handle form submission
router.post('/signup', (req, res) => {
    let error = null;
    if(req.body.password !== req.body.confirmPass) {
        error = 'passwords do not match';
        return res.render('signup.ejs', {error});
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword
    User.create(req.body, (err, newUser) => {
        req.session.userId = newUser._id;
        res.redirect('/locations');
    })


});

//login users

module.exports = router