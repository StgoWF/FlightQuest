const Sequelize = require('sequelize');
const config = require('../config/config');
const UserModel = require('./user');
const TripModel = require('./trip');
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];
let sequelize;

if (dbConfig.use_env_variable) {
    sequelize = new Sequelize(process.env[dbConfig.use_env_variable]);
} else {
    sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: console.log
    });
}

// Log the connection status

const User = UserModel(sequelize, Sequelize);
const Trip = TripModel(sequelize, Sequelize);

User.hasMany(Trip, { foreignKey: 'userId' });
Trip.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Trip
};
