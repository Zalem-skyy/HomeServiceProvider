document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check for the universal token
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in first.');
        return window.location.href = 'index.html';
    }

    const jobsList = document.getElementById('jobsList');

    try {
        // 2. Decode the user ID from the universal token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        // 3. Fetch this user's provider profile
        const profileRes = await fetch(`http://localhost:5000/api/providers/user/${userId}`);

        if (profileRes.status === 404) {
            // User has not onboarded as a provider yet
            alert('You have not set up a provider profile yet.');
            return window.location.href = 'provider-auth.html';
        }

        const providerProfile = await profileRes.json();

        // 4. Check if approved by Admin
        if (!providerProfile.is_verified) {
            jobsList.innerHTML = `
                <div style="background: #fff3cd; color: #856404; padding: 15px; border-radius: 6px; text-align: center;">
                    <h4>Account Pending Approval</h4>
                    <p style="margin: 0; font-size: 13px;">Your provider application is awaiting admin verification.</p>
                </div>
            `;
            return;
        }

        // 5. Fetch jobs using the real provider ID
        const response = await fetch(`http://localhost:5000/api/bookings/provider/${providerProfile.id}`);
        const jobs = await response.json();

        if (jobs.length === 0) {
            jobsList.innerHTML = '<p>No jobs assigned to you yet.</p>';
            return;
        }

        jobsList.innerHTML = ''; 

        jobs.forEach(job => {
            const dateObj = new Date(job.appointment_date);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const card = document.createElement('div');
            card.className = 'job-card';

            const actionButtons = job.status === 'pending' 
                ? `<div class="job-actions">
                       <button class="action-btn btn-complete" onclick="completeJob(${job.id})">Mark Completed</button>
                   </div>`
                : '';

            card.innerHTML = `
                <div class="job-info">
                    <h4>Customer: ${job.user_name}</h4>
                    <p>Date: ${formattedDate}</p>
                    <div class="status ${job.status}">${job.status}</div>
                </div>
                ${actionButtons}
            `;

            jobsList.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading provider dashboard:', error);
        jobsList.innerHTML = '<p style="color: red;">Error loading dashboard.</p>';
    }
});

// Logout back to main index
window.logout = () => {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
};

window.completeJob = (jobId) => {
    alert(`Logic to mark job ${jobId} as completed goes here!`);
};
