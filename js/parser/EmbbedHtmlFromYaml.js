/**
 * cdn/parser/EmbbedHtmlFromYaml.js
 *
 * This script enables embedding a dynamically generated HTML iframe from YAML and HTML template files.
 * Users can define an iframe by adding a div element with the following attributes:
 * - `yml-path`: The path to the YAML file containing the data.
 * - `html-path`: The path to the HTML template file.
 * - `height`: The desired height of the iframe in pixels (optional, defaults to 600px).
 *
 * It relies on the `js-yaml` library and a `convertYamlToHtml` function (expected to be loaded separately).
 */

(function() {
    // Ensure js-yaml is available
    if (typeof jsyaml === 'undefined') {
        console.error("js-yaml library is not loaded. Please include it before EmbbedHtmlFromYaml.js.");
        return;
    }

    // Ensure convertYamlToHtml is available
    if (typeof convertYamlToHtml === 'undefined') {
        console.error("convertYamlToHtml function is not loaded. Please include it before EmbbedHtmlFromYaml.js.");
        return;
    }

    /**
     * Fetches the content of a file from a given URL.
     * @param {string} url - The URL of the file to fetch.
     * @returns {Promise<string>} A promise that resolves with the file content.
     */
    async function fetchFileContent(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error fetching file content from ${url}:`, error);
            throw error; // Re-throw to be caught by the caller
        }
    }

    /**
     * Creates and displays an iframe with converted HTML content.
     * @param {HTMLElement} containerDiv - The div element that triggered the iframe creation.
     * @param {string} ymlContent - The content of the YAML file.
     * @param {string} htmlTemplateContent - The content of the HTML template file.
     */
    async function embedIframe(containerDiv, ymlContent, htmlTemplateContent) {
        const iframeHeight = containerDiv.getAttribute('height') || '600px'; // Default height
        let convertedHtml;

        try {
            // Use the imported convertYamlToHtml function
            convertedHtml = convertYamlToHtml(ymlContent, htmlTemplateContent);
        } catch (error) {
            console.error("YAML to HTML conversion error:", error);
            containerDiv.innerHTML = `<div style="color: red; font-weight: bold;">Error converting YAML to HTML: ${error.message}</div>`;
            return;
        }

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = iframeHeight;
        iframe.style.backgroundColor = 'white';
        iframe.style.border = '1px solid #ccc'; // Add a subtle border for visibility

        // Load the converted HTML into the iframe
        const blob = new Blob([convertedHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        iframe.src = url;

        // Replace the container div with the iframe
        containerDiv.parentNode.replaceChild(iframe, containerDiv);

        // Clean up the object URL after the iframe has loaded (optional but good practice)
        iframe.onload = () => {
            URL.revokeObjectURL(url);
        };
    }

    /**
     * Initializes the script by finding all designated divs and processing them.
     */
    function initializeEmbedder() {
        const divsToProcess = document.querySelectorAll('div[yml-path][html-path]');

        divsToProcess.forEach(div => {
            const ymlPath = div.getAttribute('yml-path');
            const htmlPath = div.getAttribute('html-path');

            if (!ymlPath || !htmlPath) {
                console.warn("Skipping div with missing 'yml-path' or 'html-path' attribute:", div);
                return;
            }

            // Fetch both files asynchronously
            Promise.all([
                fetchFileContent(ymlPath),
                fetchFileContent(htmlPath)
            ])
            .then(([ymlContent, htmlTemplateContent]) => {
                embedIframe(div, ymlContent, htmlTemplateContent);
            })
            .catch(error => {
                console.error(`Failed to process div for yml="${ymlPath}", html="${htmlPath}":`, error);
                div.innerHTML = `<div style="color: red; font-weight: bold;">Failed to load or process files: ${error.message}</div>`;
            });
        });
    }

    // Run initialization when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEmbedder);
    } else {
        // DOM is already ready
        initializeEmbedder();
    }

})();
