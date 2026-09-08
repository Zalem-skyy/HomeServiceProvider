document.addEventListener('DOMContentLoaded', async () => {
    // Check for the PROIVDER token specifically
    const token = localStorage.getItem('providerToken');
    if (!token) return window.location.href = 'provider-auth.html';

    const jobsList = document.getElementById('jobsList');

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Make sure a regular user didn't accidentally wander here
        if (payload.role !== 'provider') {
            alert('Unauthorized. Providers only.');
            return window.location.href = 'customer-auth.html';
        }

        const providerId = payload.id;
        const response = await fetch(`http://localhost:5000/api/bookings/provider/${providerId}`);
        const jobs = await response.json();

        if (jobs.length === 0) {
            jobsList.innerHTML = '<p>No jobs assigned to you yet.</p>';
            return;
        }

        jobsList.innerHTML = ''; 

        jobs.forEach(job => {
            const dateObj = new Date(job.appointment_date);
            const formattedDate = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const card = document.createElement('div');
            card.className = 'job-card';

            // Only show the 'Complete Job' button if the job is still pending
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
        console.error('Error fetching jobs:', error);
        jobsList.innerHTML = '<p>Error loading jobs.</p>';
    }
});

// Simple logout function
window.logout = () => {
    localStorage.removeItem('providerToken');
    window.location.href = 'provider-auth.html';
};

// Placeholder for the completion logic we will build next
window.completeJob = (jobId) => {
    alert(`Logic to mark job ${jobId} as completed goes here!`);
};