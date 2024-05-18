// Import required modules
const express = require('express');
const router = express.Router();

// Route to handle the root URL
router.get('/', (req, res) => {
    res.render('search', { title: 'Home Page' }); // Ensure 'search.handlebars' exists in your views folder
});

// Route for the search page, which is accessible only after login
router.get('/search', (req, res) => {
    if (!req.session.logged_in) {
        return res.redirect('/login');
    }
    res.render('search', { layout: 'main', logged_in: req.session.logged_in });
});

module.exports = router;
