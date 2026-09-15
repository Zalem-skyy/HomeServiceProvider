document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Grab all potential URL parameters
    const category = urlParams.get('category');
    const keyword = urlParams.get('keyword');
    const location = urlParams.get('location');

    const titleElement = document.getElementById('categoryTitle');
    const providerList = document.getElementById('providerList');
    
    let apiUrl = '';

    // 1. Determine which API endpoint to hit based on the URL
    if (keyword || location) {
        titleElement.textContent = 'Search Results';
        
        // Build the search query string securely
        const searchParams = new URLSearchParams();
        if (keyword) searchParams.append('keyword', keyword);
        if (location) searchParams.append('location', location);
        
        apiUrl = `http://192.168.85.1:5000/api/providers/search?${searchParams.toString()}`;
    } else if (category) {
        titleElement.textContent = category;
        apiUrl = `http://192.168.85.1:5000/api/providers/category/${category}`;
    } else {
        providerList.innerHTML = '<p style="text-align:center;">No search parameters provided.</p>';
        return;
    }

    try {
        // 2. Fetch the providers
        const response = await fetch(apiUrl);
        const providers = await response.json();

        if (providers.length === 0) {
            providerList.innerHTML = '<p style="text-align:center; margin-top:20px;">No providers match your criteria.</p>';
            return;
        }

        providerList.innerHTML = ''; // Clear loading text

        // 3. Render the Provider Cards
        providers.forEach(provider => {
            const card = document.createElement('div');
            card.className = 'provider-card';
            
            // We added the location to the UI so users can verify the search worked!
            card.innerHTML = `
                <div class="avatar"></div>
                <div class="info">
                    <h4>${provider.name}</h4>
                    <p style="font-size: 11px; color: #888;">📍 ${provider.location || 'Location not specified'}</p>
                    <p>0 jobs completed</p>
                    <div class="rating">★ New</div>
                </div>
                <div>
                    <p style="margin:0 0 5px; font-weight:bold; font-size:14px; text-align:right;">$50/hr</p>
                    <button class="book-btn" onclick="bookProvider(${provider.id})">Book</button>
                </div>
            `;
            
            providerList.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load providers:', error);
        providerList.innerHTML = '<p style="text-align:center; color: red;">Error loading providers.</p>';
    }
});

// Placeholder function for the booking action
async function bookProvider(providerId) {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please log in first!");

    // Extract the userId directly from the JWT payload for our prototype
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;
    
    // Set a mock appointment date for tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = tomorrow.toISOString().slice(0, 19).replace('T', ' ');

    try {
        const response = await fetch('http://192.168.85.1:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, providerId, date })
        });

        if (response.ok) {
            alert('Booking Successful! Redirecting to dashboard...');
            window.location.href = 'user-dash.html';
        } else {
            alert('Failed to book provider.');
        }
    } catch (error) {
        alert('Server error.');
    }
}