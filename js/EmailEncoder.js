document.addEventListener("DOMContentLoaded", function() {
  const emailLinks = document.querySelectorAll('.encode-email');

  emailLinks.forEach(link => {
    const email = link.getAttribute('data-email');
    const decodedEmail = decodeURIComponent(email); // decode URL-encoded email
    const replacedEmail = decodedEmail.replace('%40', '@'); // replace %40 with @
    link.href = `mailto:${replacedEmail}`; // set href attribute
  });
});