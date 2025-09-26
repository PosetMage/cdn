// convertYamlToHtml.js
// This script provides a pure function to convert YAML content into an HTML template.
// It relies on the 'jsyaml' library being available in the global scope.

/**
 * Converts YAML content to an HTML string by replacing placeholders in a template.
 *
 * @param {string} yamlContent - The string content of the YAML file.
 * @param {string} templateHtml - The string content of the HTML template.
 * @returns {string} The converted HTML string with placeholders replaced.
 * @throws {Error} If jsyaml is not loaded or if YAML parsing fails.
 */
function convertYamlToHtml(yamlContent, templateHtml) {
    // Ensure jsyaml is available. This function assumes it's loaded globally.
    if (typeof jsyaml === 'undefined') {
        throw new Error("jsyaml library is not loaded. Please include it before calling this function.");
    }

    let parsedContent;
    try {
        // Parse the YAML content into a JavaScript object
        parsedContent = jsyaml.load(yamlContent);
    } catch (e) {
        throw new Error(`Error parsing YAML content: ${e.message}`);
    }

    let htmlOutput = templateHtml;

    // Replace placeholders in the template with actual content from the YAML file
    Object.entries(parsedContent).forEach(([key, value]) => {
        let replacementValue;
        if (Array.isArray(value)) {
            // Convert array to a HTML list
            // Ensure items in array are also strings before mapping
            replacementValue = '<ul>' + value.map(item => `<li>${String(item)}</li>`).join('') + '</ul>';
        } else {
            // For simplicity, we assume value is directly a string or can be represented as one
            // Replace newlines with <br> tags for HTML rendering
            replacementValue = String(value).replace(/\n/g, '<br>');
        }

        // Create a regex to find the placeholder in the HTML template, globally
        // Using a more robust regex to ensure we only match {{key}} and not parts of other words
        // and to handle keys that might contain special regex characters if we were to construct it dynamically.
        // For simplicity here, we escape the key.
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special regex characters
        const regex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g');

        // Replace the placeholder with the actual content
        htmlOutput = htmlOutput.replace(regex, replacementValue);
    });

    // Return the modified HTML, ready for display or download
    return htmlOutput;
}
