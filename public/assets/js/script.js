let currentImageIndex = 0;
let imageArray = ['./assets/images/UI MockUps/Flight Search Engine Pics/pic1.png', './assets/images/UI Mock Ups/Flight Search Engine Pics/pic2.png', './assets/images/UI Mock Ups/Flight Search Engine Pics/pic3.png'];

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

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
        console.log('Deleting flight with ID:', tripId);
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
        console.log('Updating flight with ID:', tripId);
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
                console.log('Update button clicked for tripId:', tripId);
                updateFlightOption(tripId);
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const tripId = this.getAttribute('data-id');
                console.log('Delete button clicked for tripId:', tripId);
                deleteFlightOption(tripId);
            });
        });
    }

    async function getAirportIDFromCity(city) {
        console.log(`Fetching airport ID for city: ${city}`);
        try {
            const response = await fetch(`/api/flights/getAirportId?city=${encodeURIComponent(city)}`);
            if (!response.ok) throw new Error('Failed to fetch airport ID');
            const data = await response.json();
            console.log(`Fetched airport ID for city ${city}: ${data.airportId}`);
            return data.airportId;
        } catch (error) {
            console.error('Error getting airport ID:', error);
            throw error;
        }
    }

    async function searchFlights(fromId, toId, departDate, passengerCounts, classType, tripType) {
        console.log(`Searching flights from ${fromId} to ${toId} on ${departDate}`);
        try {
            const response = await fetch(`/api/flights/search-flights?fromId=${fromId}&toId=${toId}&departDate=${departDate}&passengers=${JSON.stringify(passengerCounts)}&class=${classType}&tripType=${tripType}`);
            if (!response.ok) throw new Error('Failed to fetch flight data');
            const data = await response.json();
            console.log('Fetched flight data:', data);
            return data;
        } catch (error) {
            console.error('Error searching flights:', error);
            throw error;
        }
    }

    function createCard(flight, isReturn) {
        const segments = flight.segments[0]; // Verify if this is correct
        const departureAirport = segments.departureAirport.code;
        const arrivalAirport = segments.arrivalAirport.code;
        const price = flight.priceBreakdown.total.units;
        const departureTime = new Date(segments.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const arrivalTime = new Date(segments.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const duration = formatDuration(segments.totalTime);
        const airlineName = segments.legs[0].carriersData[0].name;
        const layovers = segments.legs[0].flightStops.join(', ');

        const card = document.createElement('section');
        card.classList.add('cardsection');

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('detailsContainer');

        const airlineInfoContainer = document.createElement('div');
        airlineInfoContainer.classList.add('airlineInfoContainer');

        const airlineCodeElement = document.createElement('div');
        airlineCodeElement.classList.add('airlineCode');
        airlineCodeElement.textContent = airlineName;
        airlineInfoContainer.appendChild(airlineCodeElement);

        const layOversElement = document.createElement('div');
        layOversElement.classList.add('layOvers');
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
        separator.classList.add('separator');
        separator.textContent = '--------------------';
        travelInfoContainer.appendChild(separator);

        const arrivalAirportElement = document.createElement('div');
        arrivalAirportElement.classList.add('arrivalAirport');
        arrivalAirportElement.innerHTML = `${arrivalAirport}<br><span class='time'>${arrivalTime}</span>`;
        travelInfoContainer.appendChild(arrivalAirportElement);

        detailsContainer.appendChild(travelInfoContainer);

        const flightDurationElement = document.createElement('div');
        flightDurationElement.classList.add('flightDuration');
        flightDurationElement.textContent = `Duration: ${duration}`;
        detailsContainer.appendChild(flightDurationElement);

        const bookingContainer = document.createElement('div');
        bookingContainer.classList.add('bookingContainer');

        const airfareElement = document.createElement('div');
        airfareElement.classList.add('airfairprice');
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
                fromCity: segments.departureAirport.city,
                toCity: segments.arrivalAirport.city,
                departDate: segments.departureTime.split('T')[0],
                returnDate: null,
                passengersAdults: 1,  // This should be dynamically set
                passengersChildren: 0,  // This should be dynamically set
                passengersInfants: 0,  // This should be dynamically set
                travelClass: 'Economy',  // This should be dynamically set
                airlineCode: airlineName,
                flightDuration: duration,
                price
            });
        });
        bookingContainer.appendChild(saveButton);

        card.appendChild(detailsContainer);
        card.appendChild(bookingContainer);

        return card;
    }

    function updateResultsDisplay(outboundResults, returnResults = null) {
        console.log(outboundResults, returnResults);
        const container = document.getElementById('resultsContainer');
        container.innerHTML = ''; // Clear the container before adding new results

        if (outboundResults.status && outboundResults.data && outboundResults.data.flightOffers && Array.isArray(outboundResults.data.flightOffers)) {
            outboundResults.data.flightOffers.forEach(outboundFlight => {
                const card = createCard(outboundFlight, false);
                container.appendChild(card);

                if (returnResults && returnResults.status && returnResults.data && returnResults.data.flightOffers && Array.isArray(returnResults.data.flightOffers)) {
                    returnResults.data.flightOffers.forEach(returnFlight => {
                        const returnCard = createCard(returnFlight, true);
                        container.appendChild(returnCard);
                    });
                }
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

    // Passenger quantity modification functions
    function modifyQuantity(passengerType, delta) {
        var input = document.getElementById(passengerType);
        var currentValue = parseInt(input.value, 10);
        currentValue += delta;

        if (currentValue < parseInt(input.min, 10)) {
            currentValue = parseInt(input.min, 10);
        }

        input.value = currentValue;
    }

    var decreaseButtons = document.querySelectorAll('.decrease');
    var increaseButtons = document.querySelectorAll('.increase');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            var type = this.closest('.passenger-count').querySelector('input[type=number]').id;
            modifyQuantity(type, -1);
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            var type = this.closest('.passenger-count').querySelector('input[type=number]').id;
            modifyQuantity(type, 1);
        });
    });

    // Toggle Dropdown Display
    function toggleDropdown() {
        var dropdown = document.getElementById("passengerDropdownContent");
        dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    var passengerBtn = document.getElementById('passengerDropdown');
    if (passengerBtn) {
        passengerBtn.addEventListener('click', toggleDropdown);
    }

    document.querySelector("#passengerDropdownHolder").addEventListener("click", function(event) {
        event.stopPropagation();
    });

    window.onclick = function(event) {
        if (!event.target.matches('#passengerDropdownHolder')) {
            var dropdowns = document.getElementsByClassName("passenger-dropdown-content");
            for (var i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.style.display === "block") {
                    openDropdown.style.display = "none";
                }
            }
        }
    };

    var departDateInput = document.getElementById('depart-date');
    var returnDateInput = document.getElementById('return-date');

    departDateInput.addEventListener('change', function() {
        if (departDateInput.value && returnDateInput.value) {
            if (departDateInput.value > returnDateInput.value) {
                returnDateInput.value = departDateInput.value;
            }
        }
    });

    returnDateInput.addEventListener('change', function() {
        if (departDateInput.value && returnDateInput.value) {
            if (returnDateInput.value < departDateInput.value) {
                departDateInput.value = returnDateInput.value;
            }
        }
    });

    var tripTypeSelector = document.getElementById('trip-type');
    tripTypeSelector.addEventListener('change', handleTripTypeChange);

    handleTripTypeChange();

    tripTypeSelector.addEventListener('change', function() {
        if (this.value === 'oneway') {
            returnDateInput.style.display = 'none';
        } else {
            returnDateInput.style.display = 'block';
        }
    });

    if (tripTypeSelector.value === 'oneway') {
        returnDateInput.style.display = 'none';
    }

    // Handle Trip Type Change
    function handleTripTypeChange() {
        var tripTypeSelector = document.getElementById('trip-type');
        var returnDateGroup = document.getElementById('return-date-group');
        var multiCityContainer = document.getElementById('multi-city-container');

        if (tripTypeSelector.value === 'oneway') {
            returnDateGroup.style.display = 'none';
        } else {
            returnDateGroup.style.display = 'block';
        }

        if (tripTypeSelector.value === 'multicity') {
            if (citySetCount === 1) {
                addCityInputs();
            }
        } else {
            multiCityContainer.innerHTML = '';
            citySetCount = 1;
        }
    }

    var citySetCount = 1;
    function addCityInputs() {
        citySetCount++;
        const container = document.getElementById('multi-city-container');
        const newCitySet = document.createElement('div');
        newCitySet.className = 'city-set';
        newCitySet.id = `city-set-${citySetCount}`;
        newCitySet.innerHTML = `
            <div class="input-group">
                <label for="from-${citySetCount}">From</label>
                <input type="text" id="from-${citySetCount}" placeholder="Enter departure city">
            </div>
            <div class="input-group">
                <label for="to-${citySetCount}">To</label>
                <input type="text" id="to-${citySetCount}" placeholder="Enter destination city">
            </div>
            <div class="input-group">
                <label for="depart-date-${citySetCount}">Depart Date</label>
                <input type="date" id="depart-date-${citySetCount}">
            </div>
            <div class="input-group">
                <label for="return-date-${citySetCount}">Return Date</label>
                <input type="date" id="return-date-${citySetCount}">
            </div>`;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'delete-city-set';
        deleteButton.textContent = '-';
        deleteButton.onclick = function() { deleteCitySet(citySetCount); };
        newCitySet.appendChild(deleteButton);

        container.insertBefore(newCitySet, container.lastChild);

        updateAddButton(container);
        let addButton = document.getElementById('add-city-button');
        addButton.classList.remove("Forced-Relative");
    }

    function updateAddButton(container) {
        let addButton = document.getElementById('add-city-button');
        if (!addButton) {
            addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.id = 'add-city-button';
            addButton.textContent = '+';
            addButton.addEventListener('click', addCityInputs);
            container.appendChild(addButton);
        }
    }

    function deleteCitySet(citySetId) {
        const citySet = document.getElementById(`city-set-${citySetId}`);
        if (citySet) {
            citySet.parentNode.removeChild(citySet);
            citySetCount--;
        }
        if (citySetCount === 1) {
            let addButton = document.getElementById('add-city-button');
            addButton.classList.add("Forced-Relative");
        }
    }

    document.querySelector(".search-btn").addEventListener("click", Searchengine);

    function Searchengine() {
        const searchData = {
            tripType: document.getElementById('trip-type').value,
            fromCity: document.getElementById('from').value,
            toCity: document.getElementById('to').value,
            departDate: document.getElementById('depart-date').value,
            returnDate: document.getElementById('return-date').value,
            passengers: {
                adults: parseInt(document.getElementById('adults').value),
                children: parseInt(document.getElementById('children').value),
                infants: parseInt(document.getElementById('infants').value)
            },
            class: document.getElementById('class').value
        };

        console.log("Search parameters:", searchData);

        getAirportIDFromCity(searchData.fromCity).then(function(fromID) {
            getAirportIDFromCity(searchData.toCity).then(function(toID) {
                console.log(`Searching flights from ${fromID} to ${toID} on ${searchData.departDate}`);
                if (searchData.tripType === 'roundtrip') {
                    searchFlights(fromID, toID, searchData.departDate, searchData.passengers, searchData.class, 'outbound')
                        .then(outboundResults => {
                            console.log("Outbound results:", outboundResults);
                            if (searchData.returnDate) {
                                searchFlights(toID, fromID, searchData.returnDate, searchData.passengers, searchData.class, 'inbound')
                                    .then(inboundResults => {
                                        console.log("Inbound results:", inboundResults);
                                        updateResultsDisplay(outboundResults, inboundResults);
                                    });
                            } else {
                                updateResultsDisplay(outboundResults);
                            }
                        });
                } else if (searchData.tripType === 'multicity') {
                    handleMultiCitySearch(searchData);
                } else {
                    searchFlights(fromID, toID, searchData.departDate, searchData.passengers, searchData.class, 'oneway')
                        .then(flightResults => {
                            console.log("Search results:", flightResults);
                            updateResultsDisplay(flightResults);
                        });
                }
            }).catch(error => {
                console.error('Error getting destination airport ID:', error);
            });
        }).catch(error => {
            console.error('Error getting departure airport ID:', error);
        });
    }

    function handleMultiCitySearch(searchData) {
        // Implement multi-city search logic here
    }

    if (window.innerWidth < 600) {
        document.querySelector(".search-btn").addEventListener("click", function() {
            document.querySelector(".search-panel").style.display = "none";
            Searchengine();
        });
    }

    function bookFlight(flightData, direction) {
        if (direction === 'outbound') {
            selectedOutboundFlight = flightData;
            clearFlightDisplay();
            searchFlights(flightData.toID, flightData.fromID, searchData.returnDate, searchData.passengers, searchData.class, 'inbound');
        } else if (direction === 'inbound') {
            const referenceNumber = Math.floor(Math.random() * 10000000000);
            alert(`Enjoy your journey! Your flight is booked, and here is your reference number: ${referenceNumber}`);
            selectedOutboundFlight = null;
            searchData = null;
            window.location.reload();
        }
    }

    function clearFlightDisplay() {
        const contentPanel = document.querySelector('.content-panel');
        contentPanel.innerHTML = '';
    }

    function showSidebar(event) {
        event.preventDefault();
        const sidebar = document.querySelector("#sidebar");
        sidebar.style.display = "flex";
    }

    function hideSidebar() {
        const sidebar = document.querySelector("#sidebar");
        sidebar.style.display = "none";
    }
});
