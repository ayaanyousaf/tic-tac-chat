// sidebar.js
document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.getElementById('hamburger-menu');
    var sidebar = document.getElementById('sidebar');
    var darkModeToggle = document.getElementById('dark-mode-toggle');

    // Function to toggle the sidebar
    function toggleSidebar() {
        hamburger.classList.toggle('open');
        sidebar.classList.toggle('open');
    }

    // Attach event listeners
    hamburger.addEventListener('click', toggleSidebar);

    // Toggle dark mode and change the innerText of the toggle
    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.innerText = document.body.classList.contains('dark-mode') ?
            'BACK TO LIGHT MODE :O' :
            'DARK MODE ;)';
    });

    // Close the sidebar when clicking outside of it (if it's open)
    document.addEventListener('click', function (e) {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            toggleSidebar();
        }
    });
});