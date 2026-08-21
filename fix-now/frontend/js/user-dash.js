document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
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
});