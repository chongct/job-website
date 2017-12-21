const express = require('express');
const router = express.Router();

const passport = require('../helpers/ppInformation');
const isLoggedIn = require('../helpers/loginBlock');

const HomeController = require('../controllers/homeController');
const AuthController = require('../controllers/AuthController');

// home none auth access
router.get('/', AuthController.login);
router.get('/home', isLoggedIn, HomeController.home);
router.get('/home/:id', isLoggedIn, HomeController.home);

// user auth
router.get('/auth/login', AuthController.login); //login route
router.post('/auth/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash : true, // 'Invalid username and/or password'
    successFlash : 'You have logged in' // allow flash messages
  })); //login post route
router.get('/auth/register', AuthController.register); //register route
router.post('/auth/register', AuthController.signup); //register post route
router.get('/auth/logout', AuthController.logout);

router.get('/exp', HomeController.exp); // input of education and work experience
router.post('/exp', HomeController.updateExp);

module.exports = router;
