document.addEventListener('DOMContentLoaded', function() {
  const elements = document.querySelectorAll('.load_as_code_session');
  
  elements.forEach(element => {
    const url = element.getAttribute('data-url');
    
    fetch(url)
      .then(response => response.text())
      .then(data => {
        const codeBlock = document.createElement('pre');
        codeBlock.textContent = data;
        element.innerHTML = '';
        element.appendChild(codeBlock);
      })
      .catch(error => {
        console.error('Error loading file:', error);
        element.textContent = 'Failed to load content.';
      });
  });
});
