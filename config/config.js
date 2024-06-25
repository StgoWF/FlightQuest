console.log("Environment:", process.env.NODE_ENV);
module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
      timestamps: true
    }
  },
  production: {
    use_env_variable: 'JAWSDB_URL',
    dialect: 'mysql',
    migrationStorageTableName: "sequelize_migrations",
    define: {
      timestamps: true
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: true
  }
};
