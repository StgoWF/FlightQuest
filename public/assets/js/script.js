document.addEventListener('DOMContentLoaded', function() {
    // Handle the signup and login messages
    const urlParams = new URLSearchParams(window.location.search);
    const signupSuccess = urlParams.get('signup');
    const loginSuccess = urlParams.get('login');
    const signupError = urlParams.get('signupError');
    const loginError = urlParams.get('loginError');

    if (signupSuccess === 'success') {
        alert('Signup successful! Please log in.');
    } else if (signupError) {
        alert('Signup failed: ' + signupError);
    }

    if (loginSuccess === 'success') {
        alert('Login successful!');
    } else if (loginError) {
        alert('Login failed: ' + loginError);
    }

    // Function to delete a saved flight
    function deleteFlightOption(tripId) {
        console.log('Deleting flight with ID:', tripId); // Add this line
        fetch(`/api/trips/delete-flight/${tripId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete flight');
            }
            return response.json();
        })
        .then(data => {
            console.log('Flight deleted:', data);
            alert('Flight deleted successfully!');
            location.reload(); // Reload the page to reflect changes
        })
        .catch(error => {
            console.error('Error deleting flight:', error);
        });
    }

    // Function to update a saved flight
    function updateFlightOption(tripId) {
        console.log('Updating flight with ID:', tripId); // Add this line
        const updatedData = {
            departDate: prompt("Enter new departure date (YYYY-MM-DD):"),
            returnDate: prompt("Enter new return date (YYYY-MM-DD):"),
            price: prompt("Enter new price:")
        };

        fetch(`/api/trips/update-flight/${tripId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update flight');
            }
            return response.json();
        })
        .then(data => {
            console.log('Flight updated:', data);
            alert('Flight updated successfully!');
            location.reload(); // Reload the page to reflect changes
        })
        .catch(error => {
            console.error('Error updating flight:', error);
        });
    }

    // Add event listeners for update and delete buttons in saved flights page
    if (window.location.pathname === '/saved-flights') {
        console.log('On saved-flights page');
        document.querySelectorAll('.update-button').forEach(button => {
            button.addEventListener('click', function() {
                const tripId = this.getAttribute('data-id');
                console.log('Update button clicked for tripId:', tripId); // Add this line
                updateFlightOption(tripId);
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const tripId = this.getAttribute('data-id');
                console.log('Delete button clicked for tripId:', tripId); // Add this line
                deleteFlightOption(tripId);
            });
        });
    }

    // Handle search form submission
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const fromCity = document.getElementById('from').value;
            const toCity = document.getElementById('to').value;
            const departDate = document.getElementById('depart-date').value;

            const passengerCounts = {
                adults: parseInt(document.getElementById('adults').value),
                children: parseInt(document.getElementById('children').value),
                infants: parseInt(document.getElementById('infants').value)
            };
            const tripTypeSelector = document.getElementById('trip-type');
            const tripType = tripTypeSelector.value;
            const classType = document.getElementById('class').value;

            console.log("Search parameters:", { fromCity, toCity, departDate, passengerCounts, tripType, classType });

            try {
                const fromIdResponse = await fetch(`/api/flights/getAirportId?city=${encodeURIComponent(fromCity)}`);
                if (!fromIdResponse.ok) throw new Error('Failed to fetch fromId');
                const fromIdData = await fromIdResponse.json();
                const fromId = fromIdData.airportId;

                const toIdResponse = await fetch(`/api/flights/getAirportId?city=${encodeURIComponent(toCity)}`);
                if (!toIdResponse.ok) throw new Error('Failed to fetch toId');
                const toIdData = await toIdResponse.json();
                const toId = toIdData.airportId;

                console.log("Airport IDs:", { fromId, toId });

                const flightResponse = await fetch(`/api/flights/search-flights?fromId=${fromId}&toId=${toId}&departDate=${departDate}&passengers=${JSON.stringify(passengerCounts)}&class=${classType}&tripType=${tripType}`);
                if (!flightResponse.ok) throw new Error('Failed to fetch flight data');
                const flightResults = await flightResponse.json();
                console.log("Search results:", flightResults);
                updateResultsDisplay(flightResults, fromCity, toCity, departDate, passengerCounts, classType);
            } catch (error) {
                console.error('Fetch error:', error);
                const container = document.getElementById('resultsContainer');
                container.innerHTML = 'Failed to load flights.';
            }
        });
    }

    function updateResultsDisplay(results, fromCity, toCity, departDate, passengerCounts, classType) {
        console.log(results);
        const container = document.getElementById('resultsContainer');
        container.innerHTML = '';

        if (results.status && results.data && results.data.flightOffers && Array.isArray(results.data.flightOffers)) {
            results.data.flightOffers.forEach(flight => {
                const segments = flight.segments[0];
                const departureAirport = segments.departureAirport.code;
                const arrivalAirport = segments.arrivalAirport.code;
                const price = flight.priceBreakdown.total.units;
                const departureTime = new Date(segments.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                const arrivalTime = new Date(segments.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                const duration = formatDuration(segments.totalTime);
                const airlineName = segments.legs[0].carriersData[0].name;
                const layovers = segments.legs[0].flightStops;

                const card = document.createElement('section');
                card.classList.add('cardsection');

                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('detailsContainer');

                const bookingContainer = document.createElement('div');
                bookingContainer.classList.add('bookingContainer');

                const airlineInfoContainer = document.createElement('div');
                airlineInfoContainer.classList.add("airlineInfoContainer");

                const airfareElement = document.createElement('div');
                airfareElement.classList.add("airfairprice");
                airfareElement.textContent = "$ " + price;
                bookingContainer.appendChild(airfareElement);

                const saveButton = document.createElement('button');
                saveButton.classList.add('saveButton');
                saveButton.textContent = 'Save Flight';
                saveButton.addEventListener('click', function() {
                    const isLoggedIn = document.body.getAttribute('data-logged-in') === 'true';
                    if (!isLoggedIn) {
                        window.location.href = '/login';
                        return;
                    }
                    saveFlightOption({
                        fromCity,
                        toCity,
                        departDate,
                        returnDate: null,
                        passengersAdults: passengerCounts.adults,
                        passengersChildren: passengerCounts.children,
                        passengersInfants: passengerCounts.infants,
                        travelClass: classType,
                        airlineCode: airlineName,
                        flightDuration: duration,
                        price
                    });
                });
                bookingContainer.appendChild(saveButton);

                const airlineCodeElement = document.createElement('div');
                airlineCodeElement.classList.add("airlineCode");
                airlineCodeElement.textContent = airlineName;
                airlineInfoContainer.appendChild(airlineCodeElement);

                const layOversElement = document.createElement('div');
                layOversElement.classList.add("layOvers");
                layOversElement.textContent = `Layovers: ${layovers}`;
                airlineInfoContainer.appendChild(layOversElement);

                detailsContainer.appendChild(airlineInfoContainer);

                const travelInfoContainer = document.createElement('div');
                travelInfoContainer.classList.add('travelInfoContainer');

                const departureAirportElement = document.createElement('div');
                departureAirportElement.classList.add('departAirport');
                departureAirportElement.innerHTML = `${departureAirport}<br><span class='time'>${departureTime}</span>`;
                travelInfoContainer.appendChild(departureAirportElement);

                const separator = document.createElement('span');
                separator.textContent = ' -------------------- ';
                travelInfoContainer.appendChild(separator);

                const arrivalAirportElement = document.createElement('div');
                arrivalAirportElement.classList.add('arrivalAirport');
                arrivalAirportElement.innerHTML = `${arrivalAirport}<br><span class='time'>${arrivalTime}</span>`;
                travelInfoContainer.appendChild(arrivalAirportElement);

                const flightDurationElement = document.createElement('div');
                flightDurationElement.classList.add('flightDuration');
                flightDurationElement.textContent = `Duration: ${duration}`;
                travelInfoContainer.appendChild(flightDurationElement);

                detailsContainer.appendChild(travelInfoContainer);

                card.appendChild(detailsContainer);
                card.appendChild(bookingContainer);

                container.appendChild(card);
            });
        } else {
            container.innerHTML = 'No flight results found.';
        }
    }

    function formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }

    function saveFlightOption(flightData) {
        fetch('/api/trips/save-flight', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(flightData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save flight');
            }
            return response.json();
        })
        .then(data => {
            console.log('Flight saved:', data);
            alert('Flight saved successfully!');
        })
        .catch(error => {
            console.error('Error saving flight:', error);
        });
    }


// document.addEventListener('DOMContentLoaded', () => {
//     const navToggle = document.querySelector('.nav-toggle');
//     const navMenu = document.querySelector('.nav-menu');

//     navToggle.addEventListener('click', () => {
//         navMenu.classList.toggle('active');
//     });

//     const numberButton = document.getElementById('numberButton');
//     const numberInput = document.getElementById('numberInput');

//     numberButton.addEventListener('click', () => {
//         const number = numberInput.value;
//         alert(`You have selected the number: ${number}`);
//     });
// });

// function quantityBtn(click) {
//     const adults = document.getElementsById("adults");
//     const sumvalue = parseInt(adults.innerText) + click;
//     console.log(sumvalue + click);
//     adults.innerText = sumvalue;

//     if(sumvalue < 0) {
//         adults.innerText = 0;
//     }
// }

// function quantityBtn(click) {
//     const children = document.getElementsById("children");
//     const sumvalue = parseInt(children.innerText) + click;
//     console.log(sumvalue + click);
//     children.innerText = sumvalue;

//     if(sumvalue < 0) {
//         children.innerText = 0;
//     }
// }
// function quantityBtn(click) {
//     const infants = document.getElementsById("infants");
//     const sumvalue = parseInt(infants.innerText) + click;
//     console.log(sumvalue + click);
//     children.innerText = sumvalue;

//     if(sumvalue < 0) {
//         infants.innerText = 0;
//     }
// }



});
// sideBar function 

function showSidebar() {
    event.preventDefault();
    const sidebar = document.querySelector("#sidebar");
    sidebar.style.display = "flex";
}
function hideSidebar() {
    const sidebar = document.querySelector("#sidebar");
    sidebar.style.display = "none";
}

