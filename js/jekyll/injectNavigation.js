document.addEventListener('DOMContentLoaded', function() {
  const navContainer = document.querySelector('.site-nav .nav-items');

  if (!navContainer) {
    console.warn('Navigation container ".site-nav .nav-items" not found.');
    return;
  }

  // --- Configuration ---
  // The URL for your site's JSON data file.
  // This assumes site.json is accessible at the root of your site.
  const siteDataUrl = '/site.json'; // Changed from navDataUrl to siteDataUrl

  // --- Fetch and Render Navigation ---
  fetch(siteDataUrl) // Fetching site.json
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(siteData => { // Renamed navItems to siteData for clarity
      // Check if the 'navigation' property exists in the fetched data
      if (!siteData.navigation || !Array.isArray(siteData.navigation)) {
        console.error('Navigation data not found or is not an array in site.json');
        navContainer.innerHTML = '<span class="nav-error">Navigation data is missing.</span>';
        return;
      }

      // Clear any existing content (like an initial "Loading...")
      navContainer.innerHTML = '';

      siteData.navigation.forEach(item => { // Accessing siteData.navigation
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
