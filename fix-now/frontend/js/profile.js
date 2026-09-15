document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    try {
        const response = await fetch(`http://localhost:5000/api/users/${payload.id}`);
        const userData = await response.json();

        if (response.ok) {
            document.getElementById('profileName').textContent = userData.name;
            document.getElementById('profileEmail').textContent = userData.email;
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
        document.getElementById('profileName').textContent = 'Error loading name';
    }
});

window.logoutUser = () => {
    // Clear all potential sessions
    localStorage.removeItem('token');
    localStorage.removeItem('providerToken');
    
    alert('You have been logged out.');
    window.location.href = 'index.html';
};
