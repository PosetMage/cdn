document.addEventListener('DOMContentLoaded', function () {
    fetch('https://posetmage.com/brands.html')
    .then(response => response.text())
    .then(html => {
        // Insert the fetched HTML into the current page
        document.getElementById('subbrands').innerHTML = html;
    })
    .catch(error => console.error('Error fetching subbrands:', error));
});
