const Sequelize = require('sequelize');
const config = require('../config/config');
const UserModel = require('./user');
const FlightModel = require('./flight');
const TripModel = require('./trip');

// Determine the environment and load the appropriate configuration
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
console.log('Current environment:', env);  // Log the current environment
console.log('Database configuration loaded:', dbConfig);  // Log the loaded database configuration

let sequelize;

// Initialize Sequelize based on the environment
if (dbConfig.use_env_variable) {
    // Use environment variable in production for the database URL
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable], {
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false // Change to true to see SQL logs in the development environment
    });
} else {
    // Detailed configuration for development
    sequelize = new Sequelize(
        dbConfig.database, 
        dbConfig.username, 
        dbConfig.password, 
        {
            host: dbConfig.host,
            dialect: dbConfig.dialect,
            define: {
                timestamps: dbConfig.define.timestamps
            },
            logging: console.log
        }
    );
}

// Function to log the database connection status
function logDatabaseConnectionStatus() {
    sequelize.authenticate()
        .then(() => console.log('Connection has been established successfully.'))
        .catch(error => console.error('Unable to connect to the database:', error));
}

// Log the connection status
logDatabaseConnectionStatus();

// Import models
const User = UserModel(sequelize, Sequelize);
const Flight = FlightModel(sequelize, Sequelize);
const Trip = TripModel(sequelize, Sequelize);

console.log('Models imported successfully');  // Log successful model importation

// Define relationships between models
User.hasMany(Flight, { foreignKey: 'userId' });
Flight.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Trip, { foreignKey: 'userId' });
Trip.belongsTo(User, { foreignKey: 'userId' });

console.log('Model relationships defined successfully');  // Log successful relationship definition

// Export the Sequelize instance and all models
module.exports = {
  sequelize,
  User,
  Flight,
  Trip
};
