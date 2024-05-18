// routes/tripRoutes.js
const express = require('express');
const { Trip } = require('../models');
const router = express.Router();

// Handle saving flights (POST)
router.post('/save-flight', async (req, res) => {
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