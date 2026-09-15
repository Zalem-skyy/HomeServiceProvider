const API_URL = 'http://localhost:5000/api/providers';
const messageDiv = document.getElementById('message');

// Toggle between Login and Register views
window.toggleForms = () => {
    const regContainer = document.getElementById('registerContainer');
    const loginContainer = document.getElementById('loginContainer');
    if (regContainer.style.display === 'none') {
        regContainer.style.display = 'block';
        loginContainer.style.display = 'none';
    } else {
        regContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    }
    messageDiv.textContent = '';
};

// Handle Provider Registration
document.getElementById('providerRegisterForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const service_category = document.getElementById('regCategory').value;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, service_category })
        });

        const data = await response.json();
        
        if (response.ok) {
            messageDiv.style.color = 'green';
            messageDiv.textContent = 'Registration successful! Your account is pending admin approval.';
            document.getElementById('providerRegisterForm').reset();
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Registration failed.';
        }
    } catch (error) {
        messageDiv.textContent = 'Server error.';
    }
});

// Handle Provider Login
document.getElementById('providerLoginForm').addEventListener('submit', async (e) => {
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
            // Save the provider token. Naming it 'providerToken' avoids conflicts with the user token!
            localStorage.setItem('providerToken', data.token);
            
            messageDiv.style.color = 'green';
            messageDiv.textContent = `Welcome back, ${data.provider.name}! Redirecting...`;
            
            // Redirect to the provider dashboard (we will build this next)
            setTimeout(() => {
                window.location.href = 'provider-dash.html';
            }, 1000);
        } else {
            messageDiv.style.color = 'red';
            messageDiv.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        messageDiv.textContent = 'Server error.';
    }
});