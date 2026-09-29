document.addEventListener('DOMContentLoaded', () => {
    // 1. Ensure the user is actually logged in first!
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You must be logged in to become a provider.");
        window.location.href = 'customer-auth.html';
        return;
    }
});

const messageDiv = document.getElementById('message');

// 2. Handle the Profile Upgrade
document.getElementById('becomeProviderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) return;

    // Decode the token to get the user's ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id;

    const service_category = document.getElementById('regCategory').value;
    const location = document.getElementById('regLocation').value;

    try {
        const response = await fetch('http://192.168.85.1:5000/api/providers/become', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, service_category, location })
        });

        const data = await response.json();
        
        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Profile created! Your account is pending admin approval.';
            document.getElementById('becomeProviderForm').reset();
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Failed to create profile.';
        }
    } catch (error) {
        messageDiv.style.color = 'red';
        messageDiv.textContent = 'Server error. Is the backend running?';
    }
});

// 3. Location Detection (Same logic as user search)
window.detectProviderLocation = () => {
    const locInput = document.getElementById('regLocation');
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
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();
            const city = data.address.city || data.address.town || data.address.state_district || data.address.county || "Unknown City";
            locInput.value = city;
        } catch (error) {
            console.error("Geocoding failed", error);
            locInput.value = "New York"; 
            alert("Could not determine city name. Please enter manually.");
        }
    }, () => {
        alert("Location permission denied. Please type your city manually.");
        locInput.value = "";
    });
};