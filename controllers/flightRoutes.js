// Import required modules
const express = require('express');
const FlightAPI = require('../public/assets/js/flightapi');
const router = express.Router();

// Route to get AirportId
router.get('/getAirportId', async (req, res) => {
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

module.exports = router;
