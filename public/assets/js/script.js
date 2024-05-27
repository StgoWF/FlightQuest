let currentImageIndex = 0; 
let imageArray = ['./assets/images/UI MockUps/Flight Search Engine Pics/pic1.png','./assets/images/UI MockUps/Flight Search Engine Pics/pic2.png','./assets/images/UI Mock Ups/Flight Search Engine Pics/pic3.png']; 

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

        GetAirportIDfromcity(searchData.fromCity).then(function(fromID) {
            GetAirportIDfromcity(searchData.toCity).then(function(toID) {
                if (searchData.tripType === 'roundtrip') {
                    SearchflightAPI(fromID, toID, searchData.departDate, 'outbound')
                        .then(() => {
                            if (searchData.returnDate) {
                                SearchflightAPI(toID, fromID, searchData.returnDate, 'inbound');
                            }
                        });
                } else if (searchData.tripType === 'multicity') {
                    handleMultiCitySearch(searchData);
                } else {
                    SearchflightAPI(fromID, toID, searchData.departDate);
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
            SearchflightAPI(flightData.toID, flightData.fromID, searchData.returnDate, 'inbound');
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

    function GetAirportIDfromcity(city) {
        const url = 'https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination?query=' + city;
        var options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8d3728dcaemsh32efdac6013419ap12f34bjsned7b35d9a858',
                'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
            }
        };

        return fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                return data.data[0].id;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function SearchflightAPI(toID, fromID, departDate) {
        const url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights?fromId=${fromID}&toId=${toID}&departDate=${departDate}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '8d3728dcaemsh32efdac6013419ap12f34bjsned7b35d9a858',
                'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
            }
        };

        return fetch(url, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                data.data.flightOffers.sort((a, b) => {
                    const priceComparison = a.priceBreakdown.total.units - b.priceBreakdown.total.units;
                    if (priceComparison !== 0) {
                        return priceComparison;
                    }
                    return a.segments[0].totalTime - b.segments[0].totalTime;
                });

                const contentPanel = document.querySelector('.content-panel');
                contentPanel.innerHTML = '';

                data.data.flightOffers.forEach(item => {
                    if (currentImageIndex === imageArray.length) {
                        currentImageIndex = 0;
                    }

                    const card = document.createElement('section');
                    card.classList.add('cardsection');
                    const imageContainer = document.createElement('div');
                    imageContainer.classList.add('imageContainer');
                    const detailsContainer = document.createElement('div');
                    detailsContainer.classList.add('detailsContainer');
                    const bookingContainer = document.createElement('div');
                    bookingContainer.classList.add('bookingContainer');
                    const airlineInfoContainer = document.createElement('div');
                    airlineInfoContainer.classList.add("airlineInfoContainer");

                    const Airfare = item.priceBreakdown.total.units;
                    const AirefareElement = document.createElement('div');
                    AirefareElement.classList.add("airfairprice");
                    AirefareElement.textContent = "$ " + Airfare;
                    bookingContainer.appendChild(AirefareElement);

                    const bookButton = document.createElement('button');
                    bookButton.classList.add('bookButton');
                    bookButton.textContent = 'Book Now';
                    bookButton.addEventListener('click', function() {
                        bookFlight(item, 'inbound');
                    });

                    bookingContainer.appendChild(bookButton);

                    const saveButton = document.createElement('button');
                    saveButton.classList.add('saveButton');
                    saveButton.innerHTML = '&#9825;';
                    saveButton.addEventListener('click', function() {
                        let savedFlights = localStorage.getItem('savedFlights');
                        savedFlights = savedFlights ? JSON.parse(savedFlights) : [];

                        if (!savedFlights.some(flight => flight.id === item.id)) {
                            saveFlightOption(item);
                            this.innerHTML = '&#9829;';
                            this.classList.add('saved');
                        } else {
                            savedFlights = savedFlights.filter(flight => flight.id !== item.id);
                            localStorage.setItem('savedFlights', JSON.stringify(savedFlights));
                            this.innerHTML = '&#9825;';
                            this.classList.remove('saved');
                        }
                    });

                    bookingContainer.appendChild(saveButton);

                    const airlineLogo = item.segments[0].legs[0].carriersData[0].logo;
                    const airlineLogoElement = document.createElement('img');
                    airlineLogoElement.classList.add("airlineLogo");
                    airlineLogoElement.src = `${airlineLogo}`;
                    airlineInfoContainer.appendChild(airlineLogoElement);

                    const airlineCode = item.segments[0].legs[0].carriersData[0].name;
                    const airlineCodeElement = document.createElement('div');
                    airlineCodeElement.classList.add("airlineCode");
                    airlineCodeElement.textContent = ` ${airlineCode}`;
                    airlineInfoContainer.appendChild(airlineCodeElement);

                    const layOvers = item.segments[0].legs[0].flightStops;
                    const layOversElement = document.createElement('div');
                    layOversElement.classList.add("layOvers");
                    layOversElement.textContent = ` ${layOvers}`;
                    airlineInfoContainer.appendChild(layOversElement);
                    console.log(layOvers);

                    detailsContainer.appendChild(airlineInfoContainer);

                    const cardImg = imageArray[currentImageIndex];
                    const cardImgElement = document.createElement('img');
                    cardImgElement.classList.add("cardImg");
                    cardImgElement.src = ` ${cardImg}`;
                    imageContainer.appendChild(cardImgElement);

                    const travelInfoContainer = document.createElement('div');
                    travelInfoContainer.classList.add('travelInfoContainer');

                    const departTime = new Date(item.segments[0].departureTime);
                    const arrivalTime = new Date(item.segments[0].arrivalTime);
                    const options = {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                    };
                    const formattedDepartTime = departTime.toLocaleTimeString('en-US', options);
                    const formattedArrivalTime = arrivalTime.toLocaleTimeString('en-US', options);

                    const departAirport = item.segments[0].departureAirport.code;
                    const departureAirportElement = document.createElement('div');
                    departureAirportElement.classList.add('departAirport');
                    departureAirportElement.innerHTML = `${departAirport}<br><span class='time'>${formattedDepartTime}</span>`;
                    travelInfoContainer.appendChild(departureAirportElement);

                    const separator = document.createElement('span');
                    separator.textContent = ' -------------------- ';
                    travelInfoContainer.appendChild(separator);

                    const arrivalAirport = item.segments[0].arrivalAirport.code;
                    const arrivalAirportElement = document.createElement('div');
                    arrivalAirportElement.classList.add('arrivalAirport');
                    arrivalAirportElement.innerHTML = `${arrivalAirport}<br><span class='time'>${formattedArrivalTime}</span>`;
                    travelInfoContainer.appendChild(arrivalAirportElement);

                    const flightDuration = formatDuration(item.segments[0].totalTime);
                    const flightDurationElement = document.createElement('div');
                    flightDurationElement.classList.add('flightDuration');
                    flightDurationElement.textContent = flightDuration;
                    travelInfoContainer.appendChild(flightDurationElement);

                    detailsContainer.appendChild(travelInfoContainer);

                    card.appendChild(imageContainer);
                    card.appendChild(detailsContainer);
                    card.appendChild(bookingContainer);

                    contentPanel.appendChild(card);
                    currentImageIndex++;
                });

                if (contentPanel) {
                    contentPanel.style.backgroundImage = 'none';
                    document.body.style.backgroundImage = 'none';
                }
            })
            .catch(error => {
                console.error('There was an issue fetching flight data:', error);
            });
    }
});

function showSidebar() {
    event.preventDefault();
    const sidebar = document.querySelector("#sidebar");
    sidebar.style.display = "flex";
}

function hideSidebar() {
    const sidebar = document.querySelector("#sidebar");
    sidebar.style.display = "none";
}
