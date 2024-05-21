
# FlightQuest

## Overview
FlightQuest is a comprehensive web application designed to help travel enthusiasts easily plan and customize their trips. It provides personalized travel options, including flights, accommodations, and activities, all tailored to the user's preferences and interests. Users can create accounts, save and modify travel plans, and review hotels.
#User Story
As a travel enthusiast, I want a web page where I can easily plan and customize my trip, so that I can have a holiday tailored to my preferences and interests. The new and improved TailorMyTrip will have a login and create account feature.

# Usage
The webpage should allow users to select travel destinations from a wide range of global locations.
Users should be able to input travel dates and preferences, such as budget and travel style (luxury, budget-friendly, etc.).
The webpage should offer suggestions for flights.
The webpage should provide detailed information about each flight, including departure, arrival, and price.
Users should be able to save and modify their travel plans.
The webpage should allow for user reviews and ratings of hotels.
The webpage will have functional login and create account features.

# Technologies Used
HTML
CSS
JavaScript
Node.js
Sequelize
Express
Bcrypt
MVC Architecture
HTTP Methods
Web Server APIs: Skyscanner API

# Features
Homepage
Top Navigation Bar: Includes links to Home, Destinations, My Plans, Log In, and Support.
Main Search Area: A prominent search box for entering travel destinations.
Date Picker: Users can input their travel dates.
Preference Filters: Options to filter by budget, travel style, and interests.
Destination Highlights: Showcases popular destinations or special deals.
Create Account: Registration page for new users.
Login: Allows users with an account to log in and view the website. Login prompt will be in the header of all pages until the user is logged in.
Destination Suggestions Page
List/Grid View: Displays suggested destinations based on user input.
Filter Options: Ability to refine search by different criteria (price, type of experience, etc.).
Destination Cards: Each card shows a brief overview of the destination, with an option to explore more.
Detailed Destination Page
Overview Section: Description of the destination, weather info, cultural norms, and travel advisories.
Accommodation Options: A list of hotels with filter options (price, ratings, etc.).
Activity Suggestions: Curated list of activities with details and booking options.
Flight Options: Flight suggestions and booking feature.
Interactive Map: Shows locations of hotels, attractions, and activities.
Customization & Booking Page
Booking Section: Option to book flights, hotels, and activities directly.
Price Summary: Total cost of the trip with the option to modify selection.
My Plans Page
List of Saved Trips: Users can view, edit, or delete their planned trips.
Support/Help Page
FAQ Section: Answers to common queries.
Live Chat/Contact Form: For additional support or inquiries.
Log In or Create an Account Page
Users can log in.
If they don’t have an account yet, it will give them the option to create one.
Comment Feature on Homepage (Optional)
Users can add saved plans to the homepage, and others can comment on or react to the saved plans.

## Getting Started
To get started with FlightQuest, follow these steps:
Clone the repository
git clone https://github.com/StgoWF/FlightQuest.git
Install dependencies
cd flightquest
npm install
node server.jsttps://github.com/your-repo/flightquest.git
Set up the database
Ensure you have a SQL database set up and configure Sequelize with your database credentials.
Start the server
npm start

## Contributing
We welcome contributions from the community! If you'd like to contribute, please follow these guidelines:
Fork the repository.
Create a new branch.
Make your changes.
Submit a pull request.
Enjoy planning your next trip with FlightQuest!
