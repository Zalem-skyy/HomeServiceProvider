document.addEventListener('DOMContentLoaded', fetchPending);

async function fetchPending() {
    const list = document.getElementById('pendingList');
    try {
        const response = await fetch('http://localhost:5000/api/admin/providers/pending');
        const providers = await response.json();

        // Check if the backend sent an error message instead of an array!
        if (!response.ok) {
            list.innerHTML = `<p style="color:red;">Backend Error: ${providers.message}</p>`;
            return;
        }

        if (providers.length === 0) {
            list.innerHTML = '<p>No pending approvals. You are all caught up!</p>';
            return;
        }

        list.innerHTML = '';
        providers.forEach(p => {
            const card = document.createElement('div');
            card.className = 'provider-card';
            
            // Render the card using the newly joined User data
            card.innerHTML = `
                <div class="provider-info">
                    <h4>${p.name} (${p.service_category})</h4>
                    <p>${p.email} | 📍 ${p.location}</p>
                </div>
                <button class="approve-btn" onclick="approve(${p.id})">Approve</button>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        list.innerHTML = '<p style="color:red;">Network Error: Could not reach the server.</p>';
    }
}

window.approve = async (id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/admin/providers/${id}/approve`, { method: 'PATCH' });
        if (res.ok) {
            alert('Provider Profile Approved!');
            fetchPending(); // Reload the list
        } else {
            alert('Failed to approve profile.');
        }
    } catch (err) {
        alert('Server error.');
    }
};