const apiUrl = 'https://travel-destinations.free.beeceptor.com/destinations'; // Your Beeceptor API endpoint

// Function to fetch and display the list of destinations from Beeceptor or localStorage
async function fetchDestinations() {
    let destinations = JSON.parse(localStorage.getItem('destinations')) || [];

    // Only fetch from Beeceptor if `localStorage` is empty
    if (destinations.length === 0) {
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                destinations = data.destinations; // Adjusted for expected JSON structure

                // Save data to localStorage for future use
                localStorage.setItem('destinations', JSON.stringify(destinations));
            } else {
                throw new Error('Failed to fetch data from Beeceptor');
            }
        } catch (error) {
            console.error('Error fetching from Beeceptor:', error);
        }
    }

    displayDestinations(destinations);
}

// Function to display the list of destinations on the homepage
function displayDestinations(destinations) {
    const destinationList = document.getElementById('destination-list');
    if (!destinationList) {
        console.error("Element with id 'destination-list' not found.");
        return;
    }
    destinationList.innerHTML = destinations.map(destination => `
        <div class="destination-item" id="destination-${destination.id}">
            <a href="destination.html?id=${destination.id}">
                <h2>${destination.name}</h2>
                <p><strong>Country:</strong> ${destination.country}</p>
            </a>
        </div>
    `).join('');
}

// Add a new destination to the DOM and localStorage
function addDestinationToDOM(destination) {
    const destinationList = document.getElementById('destination-list');
    if (destinationList) {
        const newDestinationHTML = `
            <div class="destination-item" id="destination-${destination.id}">
                <a href="destination.html?id=${destination.id}">
                    <h2>${destination.name}</h2>
                    <p><strong>Country:</strong> ${destination.country}</p>
                </a>
            </div>
        `;
        destinationList.insertAdjacentHTML('beforeend', newDestinationHTML);
    }
}

// Run fetchDestinations only on index.html load
if (window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', fetchDestinations);
}

// Handle form submission in create.html
if (window.location.pathname.endsWith('create.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('create-form').addEventListener('submit', (event) => {
            event.preventDefault();

            const newDestination = {
                id: Date.now(),
                name: document.getElementById('name').value,
                country: document.getElementById('country').value,
                bestSeason: document.getElementById('bestSeason').value,
                attractions: document.getElementById('attractions').value,
                cost: document.getElementById('cost').value,
            };

            // Retrieve and update destinations in localStorage
            let destinations = JSON.parse(localStorage.getItem('destinations')) || [];
            destinations.push(newDestination);
            localStorage.setItem('destinations', JSON.stringify(destinations));

            // Redirect to index.html without query parameters to see the new destination
            window.location.href = 'index.html';
        });
    });
}

// Fetch and display a single destination's details
async function fetchDestinationDetails() {
    const params = new URLSearchParams(window.location.search);
    const destinationId = parseInt(params.get('id'));

    const destinations = JSON.parse(localStorage.getItem('destinations')) || [];
    const destination = destinations.find(d => d.id === destinationId);

    const detailsContainer = document.getElementById('destination-details');
    if (destination && detailsContainer) {
        detailsContainer.innerHTML = `
            <h1>${destination.name}</h1>
            <p><strong>Country:</strong> ${destination.country}</p>
            <p><strong>Best Season to Visit:</strong> ${destination.bestSeason}</p>
            <p><strong>Top Attractions:</strong> ${destination.attractions}</p>
            <p><strong>Approximate Cost:</strong> ${destination.cost}</p>
        `;
    } else {
        detailsContainer.innerHTML = `<p>Destination not found.</p>`;
    }
}

// Load destination details if on destination.html
if (window.location.pathname.endsWith('destination.html')) {
    document.addEventListener('DOMContentLoaded', fetchDestinationDetails);
}
