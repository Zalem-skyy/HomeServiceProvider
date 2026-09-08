let allBookings = [];
let currentTab = 'active'; // 'active' or 'history'
let isListView = false;

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.href = 'customer-auth.html';

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const response = await fetch(`http://localhost:5000/api/bookings/user/${payload.id}`);
        allBookings = await response.json();
        
        renderBookings();
    } catch (error) {
        document.getElementById('bookingsList').innerHTML = '<p>Error loading bookings.</p>';
    }
});

// Render the filtered list to the DOM
function renderBookings() {
    const container = document.getElementById('bookingsList');
    container.innerHTML = ''; // Clear current

    // Filter logic: 'active' shows pending, 'history' shows cancelled/completed
    const filtered = allBookings.filter(b => 
        currentTab === 'active' ? b.status === 'pending' : b.status !== 'pending'
    );

    if (filtered.length === 0) {
        container.innerHTML = `<p>No ${currentTab} bookings found.</p>`;
        return;
    }

    filtered.forEach(booking => {
        const dateObj = new Date(booking.appointment_date);
        const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const card = document.createElement('div');
        card.className = 'booking-card';
        card.onclick = () => window.location.href = `booking-details.html?id=${booking.id}`;

        card.innerHTML = `
            <div class="booking-info">
                <h4>${booking.provider_name}</h4>
                <p>${formattedDate}</p>
            </div>
            <div class="status ${booking.status}">${booking.status}</div>
        `;
        container.appendChild(card);
    });
}

// Switch between Active and History tabs
window.switchTab = (tab) => {
    currentTab = tab;
    document.getElementById('tab-active').classList.toggle('active', tab === 'active');
    document.getElementById('tab-history').classList.toggle('active', tab === 'history');
    renderBookings();
};

// Toggle between Card and List view
window.toggleView = () => {
    isListView = !isListView;
    document.getElementById('viewToggle').textContent = isListView ? 'Card View' : 'List View';
    document.getElementById('bookingsList').classList.toggle('list-view', isListView);
};