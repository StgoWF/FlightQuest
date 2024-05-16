document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-btn');
    searchButton.addEventListener('click', async function(event) {
        event.preventDefault(); // Prevent the default form submission
        const fromId = document.getElementById('from').value;
        const toId = document.getElementById('to').value;
        const departDate = document.getElementById('depart-date').value;

        try {
            const response = await fetch(`/search-flights?fromId=${fromId}&toId=${toId}&departDate=${departDate}`);
            if (!response.ok) throw new Error('Failed to fetch data');
            const results = await response.json();
            updateResultsDisplay(results);
        } catch (error) {
            console.error('Fetch error:', error);
            // Optionally update the UI to show an error message
            const container = document.getElementById('resultsContainer');
            container.innerHTML = 'Failed to load flights.';
        }
    });
});

function updateResultsDisplay(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = ''; // Clear previous results
    results.forEach(flight => {
        const element = document.createElement('div');
        element.textContent = `Flight from ${flight.from} to ${flight.to} - Price: $${flight.price}`;
        container.appendChild(element);
    });
}
