// LoadAsCodeSession.js

document.addEventListener('DOMContentLoaded', function() {
  // 1. Initial Processing of Existing Elements
  const initialLoadAsCodeElements = document.querySelectorAll('.load_as_code_session');
  initialLoadAsCodeElements.forEach(loadCodeAndAddCopy);

  // 2. Mutation Observer for Dynamically Added Elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.classList && node.classList.contains('load_as_code_session')) {
          loadCodeAndAddCopy(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 3. Load Code, Add Copy Button, and Highlight (Reusable Function)
  function loadCodeAndAddCopy(element) {
    const url = element.getAttribute('data-url');
    const lang = element.getAttribute('lang');

    fetch(url)
      .then(response => response.text())
      .then(data => {
        const container = document.createElement('div');
        container.style.position = 'relative';

        const codeBlock = document.createElement('pre');
        const codeElement = document.createElement('code');
        codeElement.textContent = data;

        if (lang) {
          codeElement.className = `language-${lang}`;
        }

        codeElement.classList.add('hljs'); // Ensure Highlight.js styling

        codeBlock.appendChild(codeElement);

        const copyButton = document.createElement('button');
        copyButton.textContent = 'Copy';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0.5em';
        copyButton.style.right = '0.5em';
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

        container.appendChild(codeBlock);
        container.appendChild(copyButton);
        element.innerHTML = '';
        element.appendChild(container);

        hljs.highlightElement(codeElement); // Highlight the code

      })
      .catch(error => {
        console.error('Error loading file:', error);
        element.textContent = 'Failed to load content.';
      });
  }
});