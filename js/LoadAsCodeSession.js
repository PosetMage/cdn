// LoadAsCodeSession.js

// 1. Import the helper that creates a download button for us.
//    (Assumes your bundler/packager or <script type="module"> setup
//     will resolve './DownloadButton.js' correctly.)
import { createDownloadButton } from './DownloadButton.js';

document.addEventListener('DOMContentLoaded', function() {
  // 1. Initial Processing of Existing Elements
  const initialLoadAsCodeElements = document.querySelectorAll('.load_as_code_session');
  initialLoadAsCodeElements.forEach(loadCodeAndAddControls);

  // 2. Mutation Observer for Dynamically Added Elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.classList && node.classList.contains('load_as_code_session')) {
          loadCodeAndAddControls(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  /**
   * loadCodeAndAddControls(element)
   * --------------------------------
   * Fetches the file at element.dataset.url, wraps it in a <pre><code>,
   * highlights it with Highlight.js, and then appends both a "Copy" button
   * and a "Download" button in the top-right of the code block.
   *
   * @param {HTMLElement} element  – the .load_as_code_session container
   */
  function loadCodeAndAddControls(element) {
    const url = element.getAttribute('data-url');
    const lang = element.getAttribute('lang');

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {
        // Create a wrapper <div> so we can position buttons absolutely
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.marginBottom = '1em';
        container.style.background = '#f5f5f5';
        container.style.borderRadius = '4px';
        container.style.padding = '1em';

        // Create the <pre><code> block
        const codeBlock = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.textContent = data;

        if (lang) {
          codeElement.className = `language-${lang}`;
        }
        // Ensure Highlight.js styling class
        codeElement.classList.add('hljs');

        codeBlock.appendChild(codeElement);

        // Create a single <div> to hold both buttons (“Copy” + “Download”)
        const buttonGroup = document.createElement('div');
        buttonGroup.style.position = 'absolute';
        buttonGroup.style.top = '0.5em';
        buttonGroup.style.right = '0.5em';
        buttonGroup.style.display = 'flex';
        buttonGroup.style.gap = '0.5em';

        // 1) Copy Button
        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.padding = '0.25em 0.5em';
        copyButton.style.background = '#eee';
        copyButton.style.border = '1px solid #ccc';
        copyButton.style.borderRadius = '4px';
        copyButton.style.cursor = 'pointer';

        copyButton.addEventListener('click', function() {
          navigator.clipboard.writeText(data)
            .then(() => {
              copyButton.textContent = 'Copied!';
              setTimeout(() => {
                copyButton.textContent = 'Copy';
              }, 2000);
            })
            .catch(err => {
              console.error('Failed to copy text: ', err);
              copyButton.textContent = 'Error';
            });
        });

        // 2) Download Button (using our new helper)
        const downloadButton = createDownloadButton(url);

        // Append both buttons into the same absolutely‐positioned group
        buttonGroup.appendChild(copyButton);
        buttonGroup.appendChild(downloadButton);

        // Put everything together
        container.appendChild(codeBlock);
        container.appendChild(buttonGroup);

        // Replace element’s contents with our new container
        element.innerHTML = '';
        element.appendChild(container);

        // Finally, run Highlight.js on the <code> element
        if (typeof hljs !== 'undefined' && hljs.highlightElement) {
          hljs.highlightElement(codeElement);
        }
      })
      .catch(error => {
        console.error('Error loading file:', error);
        element.textContent = 'Failed to load content.';
      });
  }
});
