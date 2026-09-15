// frontend/js/dark-mode.js

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user previously turned on dark mode
    const isDark = localStorage.getItem('darkMode') === 'true';
    
    // Apply the class immediately if true
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
});

// The global toggle function
window.toggleDarkMode = () => {
    const body = document.body;
    body.classList.toggle('dark-mode');
    
    // Save the new state to localStorage so it persists across pages
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
};
