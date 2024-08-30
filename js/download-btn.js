// Select all buttons with the class 'download-btn'
const downloadButtons = document.querySelectorAll('.download-btn');

// Add event listeners to each button
downloadButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Get the URL from the data-url attribute of the clicked button
        const fileUrl = this.getAttribute('data-url');
        
        // Fetch the file and download it
        fetch(fileUrl)
            .then(response => response.blob()) // Convert response to blob
            .then(blob => {
                // Create a link element to trigger download
                const a = document.createElement('a');
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                // Set the file name dynamically from the URL (or hard-code it)
                a.download = fileUrl.split('/').pop(); 
                document.body.appendChild(a);
                a.click();  // Trigger download
                // Clean up
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 0);
            })
            .catch(error => console.error('Error downloading file:', error));
    });
});
