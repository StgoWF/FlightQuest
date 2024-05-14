document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('search-btn');
    searchButton.addEventListener('click', async function() {
        const fromId = document.getElementById('from').value;
        const toId = document.getElementById('to').value;
        const departDate = document.getElementById('depart-date').value;

        const results = await fetch(`/search?fromId=${fromId}&toId=${toId}&departDate=${departDate}`)
                            .then(response => response.json());
        updateResultsDisplay(results);
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
