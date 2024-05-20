const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const router = express.Router();

// Display the login page
router.get('/login', (req, res) => {
    const loginError = req.query.loginError;
    res.render('login', { layout: 'main', loginError });
});

// Handle login logic
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { username: req.body.username } });
        if (!user) {
            res.redirect('/login?loginError=Incorrect%20username%20or%20password.');
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.redirect('/login?loginError=Incorrect%20username%20or%20password.');
            return;
        }

        req.session.save(() => {
            req.session.user_id = user.id;
            req.session.logged_in = true;
            res.redirect('/search?login=success');
        });
    } catch (error) {
        res.redirect(`/login?loginError=${encodeURIComponent(error.message)}`);
    }
});

// Display the signup page
router.get('/signup', (req, res) => {
    const signupError = req.query.signupError;
    res.render('signup', { layout: 'main', signupError });
});

// Handle user registration
router.post('/signup', async (req, res) => {
    try {
        await User.create({
            username: req.body.username,
            password: req.body.password // Hash password before saving
        });

        res.redirect('/login?signup=success');
    } catch (error) {
        res.redirect(`/signup?signupError=${encodeURIComponent(error.message)}`);
    }
});

// Logout route (GET)
router.get('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    } else {
        res.status(400).send('No session found');
    }
});

// Logout route (POST)
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).json({ message: 'No user session found' });
    }
});

module.exports = router;
