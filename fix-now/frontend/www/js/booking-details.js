document.addEventListener('DOMContentLoaded', async () => {
    // 1. Get the booking ID from the URL (e.g., ?id=5)
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id');
    const contentDiv = document.getElementById('bookingContent');

    if (!bookingId) {
        contentDiv.innerHTML = '<p style="color: red; text-align: center;">Invalid Booking ID.</p>';
        return;
    }

    try {
        // 2. Fetch the specific booking from the backend
        const response = await fetch(`http://192.168.85.1:5000/api/bookings/${bookingId}`);
        const booking = await response.json();

        if (!booking || !booking.id) {
            contentDiv.innerHTML = '<p style="color: red; text-align: center;">Booking not found.</p>';
            return;
        }

        // 3. Format the date beautifully
        const dateObj = new Date(booking.appointment_date);
        const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // 4. Render the details card
        contentDiv.innerHTML = `
            <div class="details-card">
                <div class="detail-row">
                    <span class="detail-label">Booking ID</span>
                    <span class="detail-value">#${booking.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Provider</span>
                    <span class="detail-value">${booking.provider_name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Service</span>
                    <span class="detail-value">${booking.service_category}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date</span>
                    <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time</span>
                    <span class="detail-value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status</span>
                    <span class="detail-value status ${booking.status}">${booking.status}</span>
                </div>
            </div>
            ${booking.status === 'pending' ? `<button class="cancel-btn" onclick="cancelBooking(${booking.id})">Cancel Booking</button>` : ''}
        `;

        // 5. Show review form if the job is completed
        const reviewSection = document.getElementById('reviewSection');
        if (booking.status === 'completed') {
            reviewSection.style.display = 'block';
        }

        // 6. Handle Review Submission
        document.getElementById('reviewForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const rating = document.getElementById('reviewRating').value;
            const feedback = document.getElementById('reviewFeedback').value;

            try {
                const res = await fetch(`http://192.168.85.1:5000/api/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId: booking.id, rating, feedback })
                });

                const data = await res.json();
                
                if (res.ok) {
                    alert('Review submitted successfully! Thank you.');
                    reviewSection.style.display = 'none';
                } else {
                    alert(`Failed to submit: ${data.message}`);
                }
            } catch (err) {
                console.error(err);
                alert('Server error. Could not submit review.');
            }
        });
    } catch (error) {
        console.error('Error fetching booking details:', error);
        contentDiv.innerHTML = '<p style="color: red; text-align: center;">Error loading details.</p>';
    }
});

async function cancelBooking(id) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
        const response = await fetch(`http://192.168.85.1:5000/api/bookings/${id}/cancel`, {
            method: 'PATCH'
        });

        if (response.ok) {
            alert('Booking cancelled successfully.');
            window.location.reload(); // Refresh the page to show the updated status
        } else {
            alert('Failed to cancel booking.');
        }
    } catch (error) {
        console.error('Error cancelling:', error);
        alert('Server error.');
    }
}