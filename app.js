const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config/config');

const env = process.env.NODE_ENV || 'development';
const { username, password, database, host, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: dialect
});

const app = express();

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up Handlebars
const handlebars = exphbs.create({});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Define the Trip model
const Trip = sequelize.define('Trip', {
  flightNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  departure: {
    type: DataTypes.STRING,
    allowNull: false
  },
  arrival: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  tableName: 'trip',
  timestamps: false
});

// Route to display the saved flights
app.get('/saved-flights', async (req, res) => {
  try {
    const flights = await Trip.findAll();
    res.render('saved-flights', { flights });
  } catch (error) {
    res.status(500).send('Error fetching flights');
  }
});

// Route to save a flight
app.post('/save-flight', async (req, res) => {
  try {
    const { flightNumber, departure, arrival, date, price } = req.body;
    await Trip.create({ flightNumber, departure, arrival, date, price });
    res.redirect('/saved-flights');
  } catch (error) {
    res.status(500).send('Error saving flight');
  }
});

sequelize.sync({ force: false }).then(() => {
    console.log('Database tables created or updated!');
    app.listen(3000, async () => {
        console.log(`Server listening on http://localhost:${3000}`);
    });
}).catch(error => {
    console.error('Failed to sync database:', error);
});
