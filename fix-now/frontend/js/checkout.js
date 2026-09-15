document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Grab the booking ID from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('id');

    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/pay`, {
            method: 'PATCH'
        });

        if (response.ok) {
            alert('Payment Successful! Thank you for using Fix Now.');
            window.location.href = 'bookings.html';
        } else {
            alert('Payment failed.');
        }
    } catch (error) {
        alert('Server error.');
    }
});
