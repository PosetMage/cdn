// InsertYTVideo.js

document.addEventListener('DOMContentLoaded', function() {
  const videoContainers = document.querySelectorAll('.insert_yt_video');

  videoContainers.forEach(container => {
    const ytTitle = container.getAttribute('yt-title');
    const ytUrl = container.getAttribute('yt-url');

    if (ytTitle && ytUrl) {
      const link = document.createElement('a');
      link.href = `https://youtu.be/${ytUrl}`;
      link.textContent = ytTitle;

      const paragraph = document.createElement('p');
      paragraph.appendChild(link);

      const iframe = document.createElement('iframe');
      iframe.width = '450';
      iframe.height = '255';
      iframe.src = `https://www.youtube.com/embed/${ytUrl}`;
      iframe.title = 'YouTube video player';
      iframe.allowFullscreen = true; // Important for modern browsers

      container.innerHTML = ''; // Clear "Loading content..."
      container.appendChild(paragraph);
      container.appendChild(iframe);
    } else {
      container.textContent = 'Error: Missing yt-title or yt-url attribute.';
    }
  });
});
