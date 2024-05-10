const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
    try {
        // Read the SQL file
        const sql = fs.readFileSync('db/schema.sql', 'utf8');

        // Split the SQL script into individual queries
        const queries = sql.split(';').filter(query => query.trim() !== '');

        // Configure the database connection
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Execute each query sequentially
        for (const query of queries) {
            try {
                await connection.query(query);
                console.log('Query executed successfully:', query);
            } catch (error) {
                console.error('Error executing query:', query);
                console.error(error);
            }
        }

        console.log('Database initialized successfully.');

        // Close the connection
        await connection.end();
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Call the function to initialize the database
initDatabase();
