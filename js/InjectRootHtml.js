// InjectRootHtml.js
document.addEventListener('DOMContentLoaded', () => {
  // Find every element that has a inject-root attribute
  const toInject = document.querySelectorAll('[inject-root]');

  toInject.forEach(el => {
    const filename = el.getAttribute('inject-root');
    fetch(`/${filename}.html`)
      .then(resp => {
        if (!resp.ok) throw new Error(`Failed to load "/${filename}.html": ${resp.statusText}`);
        return resp.text();
      })
      .then(text => {
        el.innerHTML = text;
      })
      .catch(err => {
        console.error(`InjectRootHtml.js: could not inject "${filename}.html" into`, el, err);
      });
  });
});
