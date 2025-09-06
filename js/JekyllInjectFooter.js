// JekyllInjectFooter.js
document.addEventListener('DOMContentLoaded', () => {
  // --- New logic to fetch site data and build the footer ---
  const siteDataUrl = '/site.json';

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
      const dataUrlElement = document.createElement('data');
      dataUrlElement.className = 'u-url';
      dataUrlElement.setAttribute('href', '/'); // Assuming root URL
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

      if (siteData.name || siteData.email) { // Check if author data exists in JSON
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
      searchButton.onclick = 'SearchSite()'; // Keep the inline onclick for now, or refactor if needed
      footerCol2.appendChild(searchButton);
      footerColWrapperDiv.appendChild(footerCol2);

      wrapperDiv.appendChild(footerColWrapperDiv);

      // Social Media List
      const socialMediaDiv = document.createElement('div');
      socialMediaDiv.className = 'social-media-list';
      socialMediaDiv.setAttribute('inject-root', 'social-media-list'); // This will be handled by the next script execution
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

      // Append the generated footer to the body (or a specific container if you have one)
      document.body.appendChild(footerElement);

      // --- Original logic for injecting other roots ---
      // Find every element that has a inject-root attribute
      const toInject = document.querySelectorAll('[inject-root]');

      toInject.forEach(el => {
        // Skip the social-media-list element we just injected if it's still being processed
        if (el.getAttribute('inject-root') === 'social-media-list') {
          // It will be processed when its own script runs, or if this script runs after it.
          // For now, we'll let it be processed by its own script.
          return;
        }

        const filename = el.getAttribute('inject-root');
        fetch(`/${filename}.html`) // Assuming these are relative to the site root
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
