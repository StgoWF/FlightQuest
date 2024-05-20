// Import required modules
const express = require('express');
const { User, Trip } = require('../models');
const router = express.Router();

// Route to handle the root URL
router.get('/', (req, res) => {
    res.render('search', { title: 'Home Page', logged_in: req.session.logged_in });
});

// Display the login page
router.get('/login', (req, res) => {
    res.render('login', { layout: 'main' });
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

// Route for the search page, which is accessible only after login
router.get('/search', (req, res) => {
    if (!req.session.logged_in) {
        return res.redirect('/login');
    }
    res.render('search', { layout: 'main', logged_in: req.session.logged_in });
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Handle fetching saved flights (GET)
router.get('/saved-flights', async (req, res) => {
    if (!req.session.logged_in) {
        return res.redirect('/login');
    }

    try {
        const savedFlights = await Trip.findAll({
            where: { userId: req.session.user_id }
        });

        const flights = savedFlights.map(trip => trip.get({ plain: true }));

        res.render('saved-flights', { flights, logged_in: req.session.logged_in });
    } catch (error) {
        console.error('Error fetching saved flights:', error);
        res.status(500).json({ error: 'Failed to fetch saved flights' });
    }
});

module.exports = router;
