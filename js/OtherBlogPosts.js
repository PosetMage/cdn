document.addEventListener('DOMContentLoaded', function() {
    fetch('/Blog/list')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract all links into an array
            const cells = Array.from(doc.querySelectorAll('tr > td'));
            
            // Function to pick random items from an array
            function pickRandomItems(arr, num) {
                const shuffled = arr.sort(() => 0.5 - Math.random());
                return shuffled.slice(0, num);
            }

            // Pick 5 random cells
            const randomCells = pickRandomItems(cells, 5);

            // Display these cells in the page
            const container = document.getElementById('randomPostsContainer');


           // Create a break and a div with text
           const breakElement = document.createElement('br');
            const divElement = document.createElement('div');
            divElement.textContent = '其他站內文章:'; // This sets the text inside the div
            divElement.style.fontSize = '2em'; // Sets the font size of the div

            // Append the break and the text div to the container
            container.appendChild(breakElement);
            container.appendChild(divElement);
            
            
            randomCells.forEach(cell => {
                const div = document.createElement('div');
                div.innerHTML = cell.innerHTML; // Using innerHTML of the cell to keep all contents
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching or processing the data:', error);
        });
});