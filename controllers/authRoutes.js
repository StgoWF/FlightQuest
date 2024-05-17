// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

// Display the login page
router.get('/login', (req, res) => {
    res.render('login', { layout: 'main' });
});

// Handle login logic
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user && user.checkPassword(req.body.password)) {
            req.session.user_id = user.id;
            req.session.logged_in = true;
            res.redirect('/search');
        } else {
            res.render('login', { error: 'Invalid username or password', layout: 'main' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('login', { error: 'Server error during authentication', layout: 'main' });
    }
});

// Display the signup page
router.get('/signup', (req, res) => {
    res.render('signup', { layout: 'main' });
});

// Handle user registration
router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: req.body.password // Hash password before saving
        });
        req.session.save(() => {
            req.session.user_id = newUser.id;
            req.session.logged_in = true;
            res.redirect('/search');
        });
    } catch (error) {
        res.render('signup', { error: 'Error creating user', layout: 'main' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;
