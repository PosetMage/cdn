document.addEventListener('DOMContentLoaded', function() {
  const siteTitleLink = document.querySelector('.site-title');

  if (!siteTitleLink) {
    console.warn('Site title element ".site-title" not found.');
    return;
  }

  // --- Configuration ---
  // The URL for your site's JSON data file.
  const siteDataUrl = '/site.json';

  // --- Fetch and Inject Title/Icon ---
  fetch(siteDataUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(siteData => {
      // Check if title and icon properties exist
      if (!siteData.title) {
        console.error('Title not found in site.json');
        siteTitleLink.textContent = 'Website'; // Fallback text
        return;
      }
      if (!siteData.icon) {
        console.warn('Icon not found in site.json');
      }

      // Create the image element
      const img = document.createElement('img');
      img.src = siteData.icon; // Use default if icon is missing
      img.setAttribute('Height', '16'); // Set height attribute
      img.style.marginRight = '8px'; // Add some spacing between icon and text

      // Clear existing content of the site-title anchor
      siteTitleLink.innerHTML = '';

      // Append the image and the title text
      siteTitleLink.appendChild(img);
      siteTitleLink.appendChild(document.createTextNode(siteData.title));
    })
    .catch(error => {
      console.error('Error fetching or injecting site title:', error);
      // Optional: Display an error message to the user
      siteTitleLink.textContent = 'Error Loading Title';
    });
});
