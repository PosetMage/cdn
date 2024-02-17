document.addEventListener('DOMContentLoaded', function() {
var headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
var toc = []; // Object to store the ToC

headers.forEach(function(header, index) {
    var id = 'header-' + index;
    header.id = id;

    toc.push({
    id: id,
    text: header.innerText,
    tagName: header.tagName
    });
});

var tocHTML = '<p><a href="' + parentDirectory + '">上一層</a></p>'; // Use the determined parent directory

toc.forEach(function(tocItem) {
    var level = parseInt(tocItem.tagName.substring(1)) - 1;
    var indent = level * 2; // Indentation based on header level
    var fontSize = (1 - level * 0.1) + 'em'; // Font size decreases with each level
    
    var style = 'text-indent: ' + indent + 'em; font-size: ' + fontSize + ';';
    var firstLineStyle = 'display: inline-block; text-indent: -' + indent + 'em; margin-left: ' + indent + 'em;';

    tocHTML += '<p style="' + style + '"><span style="' + firstLineStyle + '"><a href="#' + tocItem.id + '">' + '◇' + tocItem.text + '</a></span></p>';
});

document.getElementById('outline').innerHTML = tocHTML; // Ensure you have an element with the ID 'outline' in your HTML
});
