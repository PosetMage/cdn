// injectMermaid.js

// Function to dynamically load a script
function loadScript(url, callback) {
    const script = document.createElement('script');
    script.src = url;
    script.onload = callback;
    // Add error handling for script loading
    script.onerror = () => {
        console.error(`Failed to load script: ${url}`);
        if (callback) {
            // If callback expects a success/failure, you might pass false here
            // For simplicity, we'll just log the error and let subsequent calls fail gracefully.
        }
    };
    document.head.appendChild(script);
}

// Function to load and inject Mermaid diagram from file
async function loadAndRenderMermaid() {
    const injectElements = document.querySelectorAll('.inject-mermaid');
    
    for (const element of injectElements) {
        const filePath = element.getAttribute('file');
        
        if (filePath) {
            try {
                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const mermaidCode = await response.text();
                
                // Create a new div with mermaid class
                const mermaidDiv = document.createElement('div');
                mermaidDiv.className = 'mermaid';
                mermaidDiv.textContent = mermaidCode;
                
                // Preserve the style from the original element
                const originalStyle = element.getAttribute('style');
                if (originalStyle) {
                    mermaidDiv.setAttribute('style', originalStyle);
                }
                
                // Replace the inject element with the mermaid div
                element.parentNode.replaceChild(mermaidDiv, element);
                
            } catch (error) {
                console.error(`Error loading or processing Mermaid file ${filePath}:`, error);
                // Optionally, display an error message in the original element's place
                const errorElement = document.createElement('div');
                errorElement.style.color = 'red'; // Make the error visible
                errorElement.textContent = `Error loading diagram from ${filePath}. See console for details.`;
                if (element.parentNode) {
                    element.parentNode.replaceChild(errorElement, element);
                }
            }
        } else {
            console.warn("An .inject-mermaid element was found without a 'file' attribute.");
        }
    }
    
    // Render all mermaid diagrams after loading
    // Check if mermaid is defined AND if it has the 'run' method
    if (typeof mermaid !== 'undefined' && typeof mermaid.run === 'function') {
        try {
            await mermaid.run(); // Use await for potentially asynchronous operations within mermaid.run
            console.log("Mermaid diagrams rendered.");
        } catch (error) {
            console.error("Error running Mermaid diagrams:", error);
        }
    } else {
        console.error("Mermaid is not loaded or initialized. Cannot run diagrams.");
    }
}

// --- Main Execution Logic ---

// This function will be called after Mermaid is loaded and initialized
function initializeMermaidAndRenderDiagrams() {
    // Ensure mermaid is available and initialized
    if (typeof mermaid !== 'undefined') {
        // Initialize Mermaid if it hasn't been already and ensure startOnLoad is false
        if (!mermaid.initialized) { // A common way to check if init has run
             mermaid.initialize({ startOnLoad: false });
             mermaid.initialized = true; // Mark as initialized
        }
        
        // Now load and render the diagrams.
        // It's best to do this after DOMContentLoaded to ensure all .inject-mermaid elements exist.
        // However, since we are injecting this script dynamically, DOMContentLoaded might have already fired.
        // So, we'll rely on the fact that this function is called after Mermaid is loaded.
        // If this script is loaded *before* DOMContentLoaded, we might need to wrap this in a DOMContentLoaded listener.
        // For robustness, let's add a listener here if it's not already ready.
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadAndRenderMermaid);
        } else {
            loadAndRenderMermaid();
        }
    } else {
        console.error("Mermaid script failed to load or initialize properly.");
    }
}

// 1. Load the Mermaid script first.
//    The callback will execute `initializeMermaidAndRenderDiagrams` after Mermaid is loaded.
//    Using a specific version is good practice for stability.
const mermaidCdnUrl = "https://unpkg.com/mermaid@10.4.0/dist/mermaid.min.js";
loadScript(mermaidCdnUrl, initializeMermaidAndRenderDiagrams);

// You might want to add a global object to prevent multiple initializations
// if this script were to be included multiple times, but for a single CDN inclusion,
// the above structure is generally fine.
