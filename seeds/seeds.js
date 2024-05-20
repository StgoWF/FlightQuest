require('dotenv').config(); 

const sequelize = require('../models').sequelize;
const { User, Trip } = require('../models');

const seedUsers = [
    {
        username: 'john_doe',
        password: 'password123'
    },
    {
        username: 'jane_smith',
        password: 'password123'
    },
    {
        username: 'admin',
        password: 'adminpass'
    }
];

const seedTrips = [
    {
        userId: 1,
        fromCity: 'New York',
        toCity: 'Los Angeles',
        departDate: '2024-05-20',
        returnDate: '2024-05-27',
        passengersAdults: 2,
        passengersChildren: 1,
        passengersInfants: 0,
        travelClass: 'economy',
        airlineCode: 'AA',
        flightDuration: '6h 30m',
        price: 500.00,
        departTime: '08:00:00',
        arrivalTime: '14:30:00'
    },
    {
        userId: 2,
        fromCity: 'San Francisco',
        toCity: 'Chicago',
        departDate: '2024-06-10',
        returnDate: '2024-06-15',
        passengersAdults: 1,
        passengersChildren: 0,
        passengersInfants: 0,
        travelClass: 'business',
        airlineCode: 'UA',
        flightDuration: '4h 0m',
        price: 800.00,
        departTime: '09:00:00',
        arrivalTime: '13:00:00'
    },
    {
        userId: 3,
        fromCity: 'Miami',
        toCity: 'Boston',
        departDate: '2024-07-05',
        returnDate: '2024-07-10',
        passengersAdults: 1,
        passengersChildren: 2,
        passengersInfants: 1,
        travelClass: 'first_class',
        airlineCode: 'DL',
        flightDuration: '3h 30m',
        price: 1200.00,
        departTime: '10:00:00',
        arrivalTime: '13:30:00'
    }
];

const seedDatabase = async () => {
    try {
        await sequelize.sync({ force: true });
        await User.bulkCreate(seedUsers, { individualHooks: true });
        await Trip.bulkCreate(seedTrips);
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
};

seedDatabase();
