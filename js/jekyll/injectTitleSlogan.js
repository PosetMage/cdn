document.addEventListener('DOMContentLoaded', function() {
  const siteTitleLink = document.querySelector('.site-title');
  const siteSloganElement = document.querySelector('.site-footer p'); // Assuming your slogan is in a <p> tag within the footer

  // Check if the site title element exists
  if (!siteTitleLink) {
    console.warn('Site title element ".site-title" not found.');
    // If the site title is not found, we might still want to inject the slogan if the footer element exists
    if (!siteSloganElement) {
      console.warn('Site slogan element ".site-footer p" not found either.');
      return;
    }
  }

  // --- Configuration ---
  // The URL for your site's JSON data file.
  const siteDataUrl = '/site.json';

  // --- Fetch and Inject Title/Icon/Slogan ---
  fetch(siteDataUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(siteData => {
      // Inject Title and Icon if the element exists
      if (siteTitleLink) {
        if (!siteData.title) {
          console.error('Title not found in site.json');
          siteTitleLink.textContent = 'Website'; // Fallback text
        } else {
          // Check if icon property exists
          if (!siteData.icon) {
            console.warn('Icon not found in site.json');
          } else {
            // Create the image element for the icon
            const img = document.createElement('img');
            img.src = siteData.icon;
            img.setAttribute('Height', '16');
            img.style.marginRight = '8px';

            // Clear existing content of the site-title anchor
            siteTitleLink.innerHTML = '';
            // Append the image and the title text
            siteTitleLink.appendChild(img);
            siteTitleLink.appendChild(document.createTextNode(siteData.title));
          }
        }
      }

      // Inject Slogan if the element exists
      if (siteSloganElement) {
        if (!siteData.slogan) {
          console.warn('Slogan not found in site.json');
          // Optionally set a default slogan or clear the existing one
          // siteSloganElement.textContent = 'Default Slogan Here';
        } else {
          siteSloganElement.textContent = siteData.slogan;
        }
      } else {
        console.warn('Site slogan element ".site-footer p" not found.');
      }
    })
    .catch(error => {
      console.error('Error fetching or injecting site data:', error);
      // Optional: Display an error message to the user
      if (siteTitleLink) {
        siteTitleLink.textContent = 'Error Loading Title';
      }
      if (siteSloganElement) {
        siteSloganElement.textContent = 'Error Loading Slogan';
      }
    });
});
