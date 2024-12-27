document.addEventListener('DOMContentLoaded', function() {
    const triggerDiv = document.querySelector('.trigger');

    if (!triggerDiv) {
        console.error('Error: Element with class "trigger" not found.');
        return;
    }

    fetch('/trigger.html')  // Adjust the path if needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            triggerDiv.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching or injecting trigger content:', error);
        });
});