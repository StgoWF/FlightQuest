# FlightQuest

## Overview
FlightQuest is a comprehensive web application designed to help travel enthusiasts easily plan and customize their trips. It provides personalized travel options, including flights, accommodations, and activities, all tailored to the user's preferences and interests. Users can create accounts, save and modify travel plans, and review hotels.

## Table of Contents
1. [Overview](#overview)
2. [User Story](#user-story)
3. [Usage](#usage)
4. [Screenshots](#screenshots)
5. [Usage](#usage)
6. [Technologies Used](#technologies-used)
7. [Demonstration](#Demonstration)
8. [Getting Started](#getting-started)
9. [Contributing](#contributing)
10. [Licensing](#licensing)

## User Story
As a travel enthusiast, I want a web page where I can easily plan and customize my trip, so that I can have a holiday tailored to my preferences and interests. The new and improved TailorMyTrip will have login and create account features.

## Usage
- The webpage allows users to select travel destinations from a wide range of global locations.
- Users can input travel dates and preferences, such as budget and travel style (luxury, budget-friendly, etc.).
- The webpage offers suggestions for flights.
- It provides detailed information about each flight, including departure, arrival, and price.
- Users can save and modify their travel plans.
- The webpage allows for user reviews and ratings of hotels.
- Functional login and create account features are included.

## Screenshots

![Flight Search](./assets/images/flights-screenshot.png)
![Hotel Search](./assets/images/hotel-screenshot.png)
![Home Page](./assets/images/index-screenshot.png)

## Demonstration

[Engage with TailorMyTrip](https://stgowf.github.io/TailorMyTrip/)
## Technologies Used
- HTML
- CSS
- JavaScript
- Node.js
- Sequelize
- Express
- Bcrypt
- MVC Architecture
- HTTP Methods
- Web Server APIs: Skyscanner API

## Features
- **Homepage**
  - Top Navigation Bar: Includes links to Home, Destinations, My Plans, Log In, and Support.
  - Main Search Area: A prominent search box for entering travel destinations.
  - Date Picker: Users can input their travel dates.
  - Preference Filters: Options to filter by budget, travel style, and interests.
  - Destination Highlights: Showcases popular destinations or special deals.
- **Create Account**: Registration page for new users.
- **Login**: Allows users with an account to log in and view the website. Login prompt will be in the header of all pages until the user is logged in.
- **Destination Suggestions Page**
  - List/Grid View: Displays suggested destinations based on user input.
  - Filter Options: Ability to refine search by different criteria (price, type of experience, etc.).
  - Destination Cards: Each card shows a brief overview of the destination, with an option to explore more.
- **Detailed Destination Page**
  - Overview Section: Description of the destination, weather info, cultural norms, and travel advisories.
  - Accommodation Options: A list of hotels with filter options (price, ratings, etc.).
  - Activity Suggestions: Curated list of activities with details and booking options.
  - Flight Options: Flight suggestions and booking feature.
  - Interactive Map: Shows locations of hotels, attractions, and activities.
- **Customization & Booking Page**
  - Booking Section: Option to book flights, hotels, and activities directly.
  - Price Summary: Total cost of the trip with the option to modify selection.
- **My Plans Page**
  - List of Saved Trips: Users can view, edit, or delete their planned trips.
- **Support/Help Page**
  - FAQ Section: Answers to common queries.
  - Live Chat/Contact Form: For additional support or inquiries.
- **Log In or Create an Account Page**
  - Users can log in.
  - If they don’t have an account yet, it will give them the option to create one.
- **Comment Feature on Homepage (Optional)**
  - Users can add saved plans to the homepage, and others can comment on or react to the saved plans.

## Getting Started
To get started with FlightQuest, follow these steps:
1. Clone the repository:
   ```sh
   git clone https://github.com/StgoWF/FlightQuest.git
2. Install dependencies:
   ```sh
    cd flightquest
    npm install
3. Set up the database:
   ```sh
    Ensure you have a SQL database set up and configure Sequelize with your database credentials.
4. Start the server:
   ```sh
    npm start

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these guidelines:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Submit a pull request.

## Licensing

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

