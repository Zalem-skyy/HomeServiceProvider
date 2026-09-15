document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'customer-auth.html';
        return;
    }

    const servicesGrid = document.querySelector('.services-grid');

    try {
        // Fetch categories from the backend
        const response = await fetch('http://localhost:5000/api/providers/categories');
        const categories = await response.json();

        // Clear the hardcoded "Plumbing" placeholders
        servicesGrid.innerHTML = '';

        // 1. Create a map of icons for your categories
        const iconMap = {
            'Plumbers': '🚰', 'Electricians': '⚡', 'Cleaners': '🧹',
            'Carpenters': '🪚', 'Painters': '🎨', 'Appliances': '📺',
            'Pest Control': '🐜', 'Movers': '📦'
        };

        categories.forEach(category => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.style.cursor = 'pointer';

            const icon = iconMap[category.name] || '🔧';
            
            serviceItem.innerHTML = `
                <div class="service-icon">${icon}</div>
                <span>${category.name}</span>
            `;
            
            serviceItem.onclick = () => {
                window.location.href = `provider-list.html?category=${encodeURIComponent(category.name)}`;
            };
            
            servicesGrid.appendChild(serviceItem);
        });
    } catch (error) {
        console.error('Failed to load categories:', error);
        servicesGrid.innerHTML = '<p>Error loading services.</p>';
    }

    // 3. Fetch Active Booking
    const activeBookingCard = document.querySelector('.active-booking');
    try {
        // Extract userId from the saved JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;
        
        const bookingRes = await fetch(`http://localhost:5000/api/bookings/active/${userId}`);
        const bookingData = await bookingRes.json();

        if (bookingData.hasBooking) {
            const booking = bookingData.booking;
            
            // Format the date
            const dateObj = new Date(booking.appointment_date);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            activeBookingCard.innerHTML = `
                <div class="provider-avatar"></div>
                <div class="booking-details">
                    <h4>${booking.provider_name} - ${booking.status}</h4>
                    <p style="margin: 0; font-size: 12px; color: #666;">Scheduled: ${formattedDate}</p>
                </div>
                <div class="progress-bar"></div>
            `;
            activeBookingCard.style.display = 'flex';
            activeBookingCard.style.cursor = 'pointer';
            activeBookingCard.onclick = () => {
                window.location.href = `booking-details.html?id=${booking.id}`;
            };
        } else {
            activeBookingCard.style.display = 'none';
            activeBookingCard.onclick = null;
        }
    } catch (error) {
        console.error('Failed to load active booking:', error);
        activeBookingCard.style.display = 'none';
    }
});

// 1. Toggle the dropdown visibility
window.toggleSearch = () => {
    const dropdown = document.getElementById('searchDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
};

// 2. Auto-detect location using Browser Geolocation & OpenStreetMap API
window.detectLocation = () => {
    const locInput = document.getElementById('searchLocation');
    locInput.value = "Detecting...";

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        locInput.value = "";
        return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
            // Free Reverse Geocoding API to turn coordinates into a City Name
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();

            // Extract city, town, or village from the response
            const city = data.address.city || data.address.town || data.address.state_district || data.address.county || "Unknown Location";

            locInput.value = city;
            document.getElementById('currentLocationText').innerText = city; // Update top header too!
        } catch (error) {
            console.error("Geocoding failed", error);
            locInput.value = "New York"; // Fallback for prototype testing
            alert("Could not determine city name. Please enter manually.");
        }
    }, (error) => {
        alert("Location permission denied. Please type your city manually.");
        locInput.value = "";
    });
};

// 3. Execute the search
window.executeSearch = () => {
    const keyword = document.getElementById('searchKeyword').value.trim();
    const location = document.getElementById('searchLocation').value.trim();

    window.location.href = `provider-list.html?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`;
};