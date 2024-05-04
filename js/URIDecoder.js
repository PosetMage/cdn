document.addEventListener("DOMContentLoaded", function() {
  // Get all elements with the class "url-decode"
  const urlDecodeElements = document.querySelectorAll('.uri-decode');

  // Loop through each element and decode the text inside
  urlDecodeElements.forEach((element) => {
    const encodedText = element.textContent;
    const decodedText = decodeURIComponent(encodedText);
    element.textContent = decodedText;
  });
});