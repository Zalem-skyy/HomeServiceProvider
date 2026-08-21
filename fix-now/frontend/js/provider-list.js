document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the category from the URL (e.g., ?category=Plumbers)
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    // 2. Update the Page Title
    document.getElementById('categoryTitle').textContent = category ? category : 'Providers';

    // 3. Generate Mock Providers
    const providerList = document.getElementById('providerList');
    
    if (!category) {
        providerList.innerHTML = '<p>No category selected.</p>';
        return;
    }

    // Mock data mimicking what the backend will eventually send
    const mockProviders = [
        { id: 1, name: 'Alice Smith', rating: '4.8', jobs: 124, price: '$40/hr' },
        { id: 2, name: 'Bob Johnson', rating: '4.5', jobs: 89, price: '$35/hr' },
        { id: 3, name: 'Charlie Davis', rating: '4.9', jobs: 210, price: '$50/hr' }
    ];

    // 4. Render the Providers
    mockProviders.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'provider-card';
        
        card.innerHTML = `
            <div class="avatar"></div>
            <div class="info">
                <h4>${provider.name}</h4>
                <p>${provider.jobs} jobs completed</p>
                <div class="rating">★ ${provider.rating}</div>
            </div>
            <div>
                <p style="margin:0 0 5px; font-weight:bold; font-size:14px; text-align:right;">${provider.price}</p>
                <button class="book-btn" onclick="bookProvider(${provider.id})">Book</button>
            </div>
        `;
        
        providerList.appendChild(card);
    });
});

// Placeholder function for the booking action
function bookProvider(id) {
    alert(`Booking logic for Provider ID: ${id} will go here!`);
}