document.addEventListener('DOMContentLoaded', function() {
  const navContainer = document.querySelector('.site-nav .nav-items');

  if (!navContainer) {
    console.warn('Navigation container ".site-nav .nav-items" not found.');
    return;
  }

  // --- Configuration ---
  // The URL for your site data JSON file, which now includes navigation.
  // Use relative_url if hosting on the same Jekyll site.
  // If hosted on a different domain/CDN, use its absolute URL.
  const siteDataUrl = '/site.json'; // Changed from navDataUrl to siteDataUrl

  // --- Fetch and Render Navigation ---
  fetch(siteDataUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(siteData => { // Changed from navItems to siteData
      // Check if the 'navigation' key exists in the fetched data
      if (!siteData.navigation || !Array.isArray(siteData.navigation)) {
        throw new Error('Navigation data not found or is not an array in site.json');
      }

      const navItems = siteData.navigation; // Extract the navigation array

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
