document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const bookingsList = document.getElementById('bookingsList');

    try {
        // Extract userId from JWT
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await fetch(`http://localhost:5000/api/bookings/user/${userId}`);
        const bookings = await response.json();

        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }

        bookingsList.innerHTML = ''; // Clear loading text

        bookings.forEach(booking => {
            const dateObj = new Date(booking.appointment_date);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const card = document.createElement('div');
            card.className = 'booking-card';
            
            // Redirect to details page when clicked
            card.onclick = () => {
                window.location.href = `booking-details.html?id=${booking.id}`;
            };

            card.innerHTML = `
                <div class="booking-info">
                    <h4>${booking.provider_name}</h4>
                    <p>${formattedDate}</p>
                </div>
                <div class="status ${booking.status}">${booking.status}</div>
            `;

            bookingsList.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        bookingsList.innerHTML = '<p>Error loading bookings.</p>';
    }
});