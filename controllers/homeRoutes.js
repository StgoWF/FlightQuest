// Import required modules
const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Assuming User is the model for your users
const router = express.Router();


// Route to handle the root URL
router.get('/', (req, res) => {
    // Render a view if using a template engine like Handlebars
    res.render('search', { title: 'Home Page' });  // Make sure 'index.handlebars' exists in your views folder

    // Or just send a simple message
    // res.send('Welcome to our application!');
});
// Display the login page
router.get('/login', (req, res) => {
    // Render the login view using the login.handlebars template
    res.render('login', { layout: 'main' });
});

// Handle login logic
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            // Set user session details
            req.session.user_id = user.id;
            req.session.logged_in = true;
            // Redirect to search page after successful login
            res.redirect('/search');
        } else {
            // Send error message if login fails
            res.render('login', { error: 'Invalid username or password', layout: 'main' });
        }
    } catch (error) {
        // Handle any server errors
        res.status(500).render('login', { error: 'Server error during authentication', layout: 'main' });
    }
});

// Display the signup page
router.get('/signup', (req, res) => {
    // Render the signup view using the signup.handlebars template
    res.render('signup', { layout: 'main' });
});

// Handle user registration
router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: await bcrypt.hash(req.body.password, 10) // Hash password before saving
        });
        // Set user session details
        req.session.user_id = newUser.id;
        req.session.logged_in = true;
        // Redirect to search page after successful registration
        res.redirect('/search');
    } catch (error) {
        // Handle any server errors
        res.render('signup', { error: 'Error creating user', layout: 'main' });
    }
});

// Route for the search page, which is accessible only after login
router.get('/search', (req, res) => {
    if (!req.session.logged_in) {
        // Redirect to login if user is not logged in
        return res.redirect('/login');
    }
    // Render the search page for logged-in users
    res.render('search', { layout: 'main' });
});

// Logout route
router.post('/logout', (req, res) => {
    // Destroy session and redirect to login page
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// Export the router
module.exports = router;
