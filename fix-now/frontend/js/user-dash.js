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

        // Loop through the data and create new elements
        categories.forEach(category => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.style.cursor = 'pointer'; // Makes it look clickable
            
            serviceItem.innerHTML = `
                <div class="service-icon"></div>
                <span>${category.name}</span>
            `;
            
            // Redirect to the new page, passing the category name in the URL
            serviceItem.onclick = () => {
                window.location.href = `provider-list.html?category=${category.name}`;
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