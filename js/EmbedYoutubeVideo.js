// EmbedYoutubeVideo.js

document.addEventListener('DOMContentLoaded', function() {
  const videoContainers = document.querySelectorAll('.embed_youtube');

  videoContainers.forEach(container => {
    const ytTitle = container.getAttribute('yt-title');
    const ytUrl = container.getAttribute('yt-url');
    const ytWidth = container.getAttribute('yt-width'); // Get the width

    if (ytTitle && ytUrl && ytWidth) { // Ensure width is also present
      const width = parseInt(ytWidth, 10); // Convert width to a number
      const height = width * 9 / 16;        // Calculate the height

      const link = document.createElement('a');
      link.href = `https://youtu.be/${ytUrl}`;
      link.textContent = ytTitle;

      const paragraph = document.createElement('p');
      paragraph.appendChild(link);

      const iframe = document.createElement('iframe');
      iframe.width = width;          // Use the specified width
      iframe.height = height;         // Use the calculated height
      iframe.src = `https://www.youtube.com/embed/${ytUrl}`;
      iframe.title = 'YouTube video player';
      iframe.allowFullscreen = true; // Important for modern browsers

      container.innerHTML = ''; // Clear "Loading content..."
      container.appendChild(paragraph);
      container.appendChild(iframe);
    } else {
      container.textContent = 'Error: Missing yt-title, yt-url, or yt-width attribute.';
    }
  });
});