document.addEventListener('DOMContentLoaded', fetchPendingProviders);

async function fetchPendingProviders() {
    const list = document.getElementById('pendingList');
    try {
        const response = await fetch('http://localhost:5000/api/admin/providers/unverified');
        const providers = await response.json();

        if (providers.length === 0) {
            list.innerHTML = '<p>No pending approvals.</p>';
            return;
        }

        list.innerHTML = '';
        providers.forEach(p => {
            const card = document.createElement('div');
            card.className = 'provider-card';
            card.innerHTML = `
                <h4>${p.name}</h4>
                <p style="margin: 5px 0; font-size: 13px; color: #555;">${p.service_category} | 📍 ${p.location || 'N/A'}</p>
                <p style="margin: 0 0 10px; font-size: 12px; color: #888;">${p.email}</p>
                <button class="verify-btn" onclick="verifyProvider(${p.id})">Approve Provider</button>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        list.innerHTML = '<p style="color: red;">Error loading providers.</p>';
    }
}

window.verifyProvider = async (id) => {
    if (!confirm('Approve this provider?')) return;
    try {
        const res = await fetch(`http://localhost:5000/api/admin/providers/${id}/verify`, { method: 'PATCH' });
        if (res.ok) {
            alert('Provider approved!');
            fetchPendingProviders();
        }
    } catch (error) {
        alert('Server error.');
    }
};
