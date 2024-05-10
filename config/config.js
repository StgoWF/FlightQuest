// config/config.js
require('dotenv').config();
console.log('Starting server...');

console.log("Environment:", process.env.NODE_ENV);
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      timestamps: true  // Make sure all created tables do not expect default timestamp fields
    }
  },
  production: {
    use_env_variable: 'JAWSDB_URL',
    dialect: 'mysql',
    migrationStorageTableName: "sequelize_migrations",
    define: {
      timestamps: true  // Apply the same for production environment
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  // Necessary for secure database connections
      }
    },
    logging: false  // Disable SQL query logging to clean up console output
  }
};
