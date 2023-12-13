const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.route('/register')
        .get( users.renderRegister)
        .post( catchAsync(users.register))

// router.post('/login', passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req,res) => {
//     req.flash('success', 'welcome back!');
//     const redirectUrl = req.session.returnTo || '/lawfirms';
//     delete req.session.returnTo;
//     res.redirect(redirectUrl);
// })
router.route('/login')           
        .get( users.renderLogin)
        .post(
    // use the storeReturnTo middleware to save the returnTo value from session to res.locals
    storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    // Now we can use res.locals.returnTo to redirect the user after login
    users.login)

router.get('/logout', users.logout); 

module.exports = router;