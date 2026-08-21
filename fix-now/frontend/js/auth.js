const API_URL = 'http://localhost:5000/api/users';
const messageDiv = document.getElementById('message');

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Registration successful! You can now log in.';
            document.getElementById('registerForm').reset();
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Registration failed.';
        }
    } catch (error) {
        messageDiv.textContent = 'Server error. Is the backend running?';
    }
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save the token to local storage
            localStorage.setItem('token', data.token);
            
            messageDiv.style.color = 'green';
            messageDiv.textContent = `Welcome back, ${data.user.name}! Redirecting...`;
            document.getElementById('loginForm').reset();

            // Redirect the user to the home page after 1 second
            setTimeout(() => {
                window.location.href = 'user-dash.html';
            }, 1000);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        messageDiv.textContent = 'Server error. Is the backend running?';
    }
});