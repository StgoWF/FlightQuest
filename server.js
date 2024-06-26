// server.js
console.log('Starting server...');
require('dotenv').config();

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}
console.log("Environment:", process.env.NODE_ENV);

const path = require('path');
const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Sequelize = require('sequelize');
const config = require('./config/config');
const methodOverride = require('method-override'); 
const { sequelize, User, Flight, Trip } = require('./models'); // Ensure all models are imported

const app = express();
const PORT = process.env.PORT || 3002;

const env = process.env.NODE_ENV || 'development';
console.log("Environment:", env);

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add method-override middleware
app.use(methodOverride('_method'));

const sess = {
    secret:'FlightQuest secret',
    cookie: {},
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    }),
    resave: false,
    saveUninitialized: true
};

sess.store.sync().catch(err => {
    console.error('Error setting up session store:', err);
});
app.use(session(sess));
console.log('Session middleware configured.');

const homeRoutes = require('./controllers/homeRoutes');
const authRoutes = require('./controllers/authRoutes');
const flightRoutes = require('./controllers/flightRoutes');
const tripRoutes = require('./controllers/tripRoutes');
// Use routes
app.use(homeRoutes);
app.use(authRoutes);
app.use('/api/flights', flightRoutes); // Routes related to flights will be under /api/flights
app.use('/api/trips', tripRoutes); // Routes related to trips will be under /api/trips


app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.render('search', { logged_in: req.session.logged_in });
});

app.get('/login', (req, res) => {
    res.render('login', { isLogin: true });
});

app.get('*', (req, res) => {
    res.render('main', { isLogin: false });
});

sequelize.sync({ force: false }).then(() => {
    console.log('Database tables created or updated!');
    app.listen(PORT, async () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Failed to sync database:', error);
});

