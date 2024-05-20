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
        const { fromCity, toCity, departDate, returnDate, passengersAdults, passengersChildren, passengersInfants, travelClass, airlineCode, flightDuration, price, departureTime } = req.body;
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
            price,
            departureTime // Adding departure time
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

// Handle deleting flights (DELETE)
router.delete('/delete-flight/:id', async (req, res) => {
    if (!req.session.logged_in) {
        return res.status(401).json({ error: 'User must be logged in to delete flights' });
    }

    try {
        const { id } = req.params;
        await Trip.destroy({ where: { id, userId: req.session.user_id } });
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        console.error('Error deleting flight:', error);
        res.status(500).json({ error: 'Failed to delete flight' });
    }
});

// Handle updating flights (PUT)
router.put('/update-flight/:id', async (req, res) => {
    if (!req.session.logged_in) {
        return res.status(401).json({ error: 'User must be logged in to update flights' });
    }

    try {
        const { id } = req.params;
        const { fromCity, toCity, departDate, returnDate, passengersAdults, passengersChildren, passengersInfants, travelClass, airlineCode, flightDuration, price, departureTime } = req.body;
        const updatedTrip = await Trip.update({
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
            price,
            departureTime // Adding departure time
        }, {
            where: { id, userId: req.session.user_id }
        });

        res.status(200).json(updatedTrip);
    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ error: 'Failed to update flight' });
    }
});

module.exports = router;
