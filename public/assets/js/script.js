document.addEventListener('DOMContentLoaded', function() {
    var tripTypeSelector = document.getElementById('trip-type');
    var multiCityContainer = document.getElementById('multi-city-container');

    tripTypeSelector.addEventListener('change', function() {
        if (this.value === 'multicity') {
            multiCityContainer.innerHTML = `
                <div class="input-group">
                    <label for="from-2">From</label>
                    <input type="text" id="from-2" placeholder="Enter additional departure city">
                </div>
                <div class="input-group">
                    <label for="to-2">To</label>
                    <input type="text" id="to-2" placeholder="Enter additional destination city">
                </div>`;
        } else {
            multiCityContainer.innerHTML = '';
        }
    });

    document.getElementById('search-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const fromCity = document.getElementById('from').value;
        const toCity = document.getElementById('to').value;
        const departDate = document.getElementById('depart-date').value;

        const passengerCounts = {
            adults: parseInt(document.getElementById('adults').value),
            children: parseInt(document.getElementById('children').value),
            infants: parseInt(document.getElementById('infants').value)
        };
        const tripType = tripTypeSelector.value;
        const classType = document.getElementById('class').value;

        console.log("Search parameters:", { fromCity, toCity, departDate, passengerCounts, tripType, classType });

        try {
            const fromIdResponse = await fetch(`/api/getAirportId?city=${encodeURIComponent(fromCity)}`);
            if (!fromIdResponse.ok) throw new Error('Failed to fetch fromId');
            const fromIdData = await fromIdResponse.json();
            const fromId = fromIdData.airportId;

            const toIdResponse = await fetch(`/api/getAirportId?city=${encodeURIComponent(toCity)}`);
            if (!toIdResponse.ok) throw new Error('Failed to fetch toId');
            const toIdData = await toIdResponse.json();
            const toId = toIdData.airportId;

            console.log("Airport IDs:", { fromId, toId });

            const flightResponse = await fetch(`/search-flights?fromId=${fromId}&toId=${toId}&departDate=${departDate}&passengers=${JSON.stringify(passengerCounts)}&class=${classType}&tripType=${tripType}`);
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
        fetch('/api/save-flight', {
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
});