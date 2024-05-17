// Import required modules
const express = require('express');
const { User, Trip } = require('../models');
const router = express.Router();
const FlightAPI = require('../models/flightapi');

// Route to handle the root URL
router.get('/', (req, res) => {
    res.render('search', { title: 'Home Page' }); // Ensure 'search.handlebars' exists in your views folder
});

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

// Route to get AirportId
router.get('/api/getAirportId', async (req, res) => {
    const city = req.query.city;  // Get the city name from query parameters
    if (!city) {
        return res.status(400).json({ error: 'City parameter is required' });
    }

    try {
        const airportId = await FlightAPI.getAirportIDFromCity(city);
        res.json({ airportId });
    } catch (error) {
        console.error('Error fetching airport ID:', error);
        res.status(500).json({ error: 'Failed to fetch airport ID' });
    }
});

// Handle the GET request for searching flights
router.get('/search-flights', async (req, res) => {
    const { fromId, toId, departDate } = req.query;
    try {
        const flightResults = await FlightAPI.searchFlights(fromId, toId, departDate);
        res.json(flightResults);  // Assuming flightResults is the correct response format you expect
    } catch (error) {
        console.error('Error fetching flight data:', error);
        res.status(500).json({ error: 'Failed to fetch flights' });
    }
});

// Handle saving flights
router.post('/api/save-flight', async (req, res) => {
    if (!req.session.logged_in) {
        return res.status(401).json({ error: 'User must be logged in to save flights' });
    }

    try {
        const { fromCity, toCity, departDate, returnDate, passengersAdults, passengersChildren, passengersInfants, travelClass, airlineCode, flightDuration, price } = req.body;
        const newTrip = await Trip.create({
            userId: req.session.user_id,
            fromCity,
            toCity,
            departDate,
            returnDate,
            passengersAdults,
            passengersChildren,
            passengersInfants,
            travelClass,
            airlineCode,
            flightDuration,
            price
        });

        res.status(201).json(newTrip);
    } catch (error) {
        console.error('Error saving flight:', error);
        res.status(500).json({ error: 'Failed to save flight' });
    }
});

// Export the router
module.exports = router;
