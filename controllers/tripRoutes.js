// Import required modules
const express = require('express');
const { Trip } = require('../models');
const router = express.Router();

// Handle saving flights
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

module.exports = router;
