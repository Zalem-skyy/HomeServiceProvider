document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the category from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    // 2. Update the Page Title
    document.getElementById('categoryTitle').textContent = category ? category : 'Providers';

    const providerList = document.getElementById('providerList');
    
    if (!category) {
        providerList.innerHTML = '<p>No category selected.</p>';
        return;
    }

    try {
        // 3. Fetch REAL providers from the database!
        const response = await fetch(`http://localhost:5000/api/providers/category/${category}`);
        const providers = await response.json();

        if (providers.length === 0) {
            providerList.innerHTML = '<p style="text-align:center; margin-top:20px;">No providers available in this category yet.</p>';
            return;
        }

        providerList.innerHTML = ''; // Clear loading text

        // 4. Render the Providers
        providers.forEach(provider => {
            const card = document.createElement('div');
            card.className = 'provider-card';
            
            // Note: We are hardcoding the rating/price for now until we build the review module!
            card.innerHTML = `
                <div class="avatar"></div>
                <div class="info">
                    <h4>${provider.name}</h4>
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
        providerList.innerHTML = '<p>Error loading providers.</p>';
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
        const response = await fetch('http://localhost:5000/api/bookings', {
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