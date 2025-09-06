document.addEventListener('DOMContentLoaded', function() {
  const navContainer = document.querySelector('.site-nav .nav-items');

  if (!navContainer) {
    console.warn('Navigation container ".site-nav .nav-items" not found.');
    return;
  }

  // --- Configuration ---
  // The URL for your navigation data JSON file.
  // Use relative_url if hosting on the same Jekyll site.
  // If hosted on a different domain/CDN, use its absolute URL.
  const navDataUrl = '/navigation.json';

  // --- Fetch and Render Navigation ---
  fetch(navDataUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(navItems => {
      // Clear any existing content (like an initial "Loading...")
      navContainer.innerHTML = '';

      navItems.forEach(item => {
        const anchor = document.createElement('a');
        anchor.className = 'nav-item';
        anchor.href = item.url;
        anchor.textContent = item.title;
        navContainer.appendChild(anchor);
      });
    })
    .catch(error => {
      console.error('Error fetching or rendering navigation:', error);
      // Optional: Display an error message to the user
      navContainer.innerHTML = '<span class="nav-error">Navigation failed to load.</span>';
    });
});
