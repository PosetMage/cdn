// DownloadButton.js

/**
 * createDownloadButton(fileUrl)
 * -----------------------------
 * Returns a <button> element styled similarly to the copy‐button,
 * with an attached click‐handler that fetches `fileUrl` and triggers
 * a download using a blob URL. You can customize styling by editing
 * the inline styles below (or moving them into your own CSS).
 *
 * @param {string} fileUrl  - the URL of the file to download
 * @returns {HTMLButtonElement}
 */
export function createDownloadButton(fileUrl) {
  const button = document.createElement('button');
  button.textContent = 'Download';
  
  // (You can move these inline styles into a CSS file if you prefer.)
  button.style.padding = '0.25em 0.5em';
  button.style.background = '#eee';
  button.style.border = '1px solid #ccc';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';

  button.addEventListener('click', function () {
    // Fetch the file as a blob, then create an <a> to download it:
    fetch(fileUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        const a = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        // Derive a filename from the URL itself (e.g. last segment)
        a.download = fileUrl.split('/').pop();
        document.body.appendChild(a);
        a.click();
        // Clean up immediately:
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        console.error('Error downloading file:', error);
        // (Optionally, you could change the button text to “Error” for a moment.)
      });
  });

  return button;
}


/**
 * initializeDownloadButtons(selector = '.download-btn')
 * -----------------------------------------------------
 * If you still have any static <button class="download-btn" data-url="...">
 * elements in your HTML, you can call this function on DOMContentLoaded to
 * wire them all up. (Older code from download‐btn.js.)
 *
 * @param {string} selector  - a CSS selector for existing buttons
 */
export function initializeDownloadButtons(selector = '.download-btn') {
  const downloadButtons = document.querySelectorAll(selector);
  downloadButtons.forEach(button => {
    const fileUrl = button.getAttribute('data-url');
    if (!fileUrl) return;

    button.addEventListener('click', () => {
      fetch(fileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.blob();
        })
        .then(blob => {
          const a = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = fileUrl.split('/').pop();
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error('Error downloading file:', error);
        });
    });
  });
}
