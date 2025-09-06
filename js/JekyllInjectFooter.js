// JekyllInjectFooter.js
document.addEventListener('DOMContentLoaded', () => {

  // --- Get the base URL from the data attribute on the script tag ---
  // Find the script tag for JekyllInjectFooter.js
  const currentScript = document.currentScript;
  let siteBaseUrl = 'https://alchemy.posetmage.com'; // Default if attribute not found

  if (currentScript && currentScript.dataset.siteBaseUrl) {
    siteBaseUrl = currentScript.dataset.siteBaseUrl;
  }
  // Ensure the base URL doesn't have a trailing slash for consistent concatenation
  siteBaseUrl = siteBaseUrl.replace(/\/$/, '');

  const siteDataUrl = `${siteBaseUrl}/site.json`;
  // --- End of new logic ---

  fetch(siteDataUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch site data from ${siteDataUrl}: ${response.statusText}`);
      }
      return response.json();
    })
    .then(siteData => {
      // Create the footer element
      const footerElement = document.createElement('footer');
      footerElement.className = 'site-footer h-card'; // Add appropriate classes

      // Add the stylesheet link for Font Awesome
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      footerElement.appendChild(fontAwesomeLink);

      // Add the data element for the URL
      // Using siteBaseUrl for the href attribute as per your general case
      const dataUrlElement = document.createElement('data');
      dataUrlElement.className = 'u-url';
      dataUrlElement.setAttribute('href', siteBaseUrl); // Use the dynamically fetched base URL
      footerElement.appendChild(dataUrlElement);

      const wrapperDiv = document.createElement('div');
      wrapperDiv.className = 'wrapper';

      const footerColWrapperDiv = document.createElement('div');
      footerColWrapperDiv.className = 'footer-col-wrapper';

      // First column: Slogan and Author Info
      const footerCol1 = document.createElement('div');
      footerCol1.className = 'footer-col';

      const sloganPara = document.createElement('p');
      sloganPara.textContent = siteData.slogan || ''; // Use slogan from JSON
      footerCol1.appendChild(sloganPara);

      // Check if author data exists in JSON
      // NOTE: If your site.json doesn't include 'name' and 'email' anymore,
      // you'll need to adjust this part to potentially fetch author info from another source
      // or remove this block if author info is not needed in the footer.
      if (siteData.name || siteData.email) {
        const contactList = document.createElement('ul');
        contactList.className = 'contact-list';

        if (siteData.name) {
          const nameListItem = document.createElement('li');
          nameListItem.className = 'p-name';
          nameListItem.textContent = siteData.name;
          contactList.appendChild(nameListItem);
        }

        if (siteData.email) {
          const emailListItem = document.createElement('li');
          const emailLink = document.createElement('a');
          emailLink.className = 'u-email';
          emailLink.href = `mailto:${siteData.email}`;
          emailLink.textContent = siteData.email;
          emailListItem.appendChild(emailLink);
          contactList.appendChild(emailListItem);
        }
        footerCol1.appendChild(contactList);
      }
      footerColWrapperDiv.appendChild(footerCol1);

      // Second column: Search Input
      const footerCol2 = document.createElement('div');
      footerCol2.className = 'footer-col';

      const searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'searchQuery';
      searchInput.placeholder = 'Enter search keywords';
      footerCol2.appendChild(searchInput);

      const searchButton = document.createElement('button');
      searchButton.textContent = 'Search with Google';
      searchButton.onclick = 'SearchSite()';
      footerCol2.appendChild(searchButton);
      footerColWrapperDiv.appendChild(footerCol2);

      wrapperDiv.appendChild(footerColWrapperDiv);

      // Social Media List - This is an element that JekyllInjectFooter.js also processes
      const socialMediaDiv = document.createElement('div');
      socialMediaDiv.className = 'social-media-list';
      socialMediaDiv.setAttribute('inject-root', 'social-media-list'); // This will be handled by the next script execution or by this script if it's the only one
      wrapperDiv.appendChild(socialMediaDiv);

      // Inline styles for social media icons
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .social-media-list i {
            font-size: 32px;
        }
        a + a {
            margin-left: 32px;
        }
      `;
      wrapperDiv.appendChild(styleElement);

      footerElement.appendChild(wrapperDiv);

      // Append the generated footer to the body
      document.body.appendChild(footerElement);

      // --- Original logic for injecting other roots ---
      // Find every element that has a inject-root attribute
      const toInject = document.querySelectorAll('[inject-root]');

      toInject.forEach(el => {
        // Skip the social-media-list element we just injected if it's still being processed
        // This helps avoid race conditions if the script runs multiple times or in parallel.
        if (el.getAttribute('inject-root') === 'social-media-list') {
          // This will be handled when its own inject-root attribute is processed.
          return;
        }

        const filename = el.getAttribute('inject-root');
        // IMPORTANT: These injected files are assumed to be relative to the site's root,
        // so they won't use siteBaseUrl directly, unless they are also designed to be dynamic.
        fetch(`/${filename}.html`)
          .then(resp => {
            if (!resp.ok) throw new Error(`Failed to load "/${filename}.html": ${resp.statusText}`);
            return resp.text();
          })
          .then(text => {
            el.innerHTML = text;
          })
          .catch(err => {
            console.error(`JekyllInjectFooter.js: could not inject "${filename}.html" into`, el, err);
          });
      });
    })
    .catch(err => {
      console.error('JekyllInjectFooter.js: Error loading or processing site data:', err);
    });
});
