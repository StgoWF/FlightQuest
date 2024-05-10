// Server.js
console.log('Starting server...');
require('dotenv').config();

const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Sequelize = require('sequelize');
const config = require('./config/config');

const app = express();
const PORT = process.env.PORT || 3002;

// Define the environment based on NODE_ENV or default to 'development'
const env = process.env.NODE_ENV || 'development';
console.log("Environment:", env);

// Initialize Sequelize based on the environment
let sequelize;
if (env === 'production') {
    sequelize = new Sequelize(process.env.JAWSDB_URL, {
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    });
    console.log("Using JAWSDB_URL for production database connection.");
} else {
    sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, {
        host: config[env].host,
        dialect: 'mysql',
        logging: false
    });
    console.log("Using local database configuration.");
}

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Database connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));

// Handlebars view engine setup
app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Middleware for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const sess = {
    secret: process.env.SESSION_SECRET || 'SuperSecretSessionKey',
    cookie: {},
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    }),
    resave: false,
    saveUninitialized: true
};
app.use(session(sess));
console.log('Session middleware configured.');

// Middleware to serve static files
app.use(express.static('public'));

// Import routes
const homeRoutes = require('./controllers/homeRoutes');

app.use(homeRoutes);


// Start the server
app.listen(PORT, async () => {
    console.log(`Server listening on http://localhost:${PORT}`);
    try {
        await sequelize.sync({ force: false });  // Sync models with DB, create tables if they don't exist
        console.log('Database tables created or updated!');
    } catch (error) {
        console.error('Failed to sync database:', error);
    }
});
