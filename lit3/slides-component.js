// File: cdn/slides-component.js
//
// A standalone Lit 3 component that handles slide presentation functionality.
// Scans for <div class="slide"> elements and provides navigation with URL hash support.
// Uses URL hash mapping system to sync with TOC component URLs.

import { LitElement, html, css } from 'https://unpkg.com/lit@3?module';

class SlidesComponent extends LitElement {
  static properties = {
    slides: { type: Array },
    currentSlideIndex: { type: Number },
    totalSlides: { type: Number },
    urlArray: { type: Array },
    urlToIndexMap: { type: Object }
  };

  static styles = css`
    :host {
      display: block;
    }

    /* Navigation buttons */
    .nav-button {
      position: fixed;
      bottom: 10px;
      font-size: 2em;
      padding: 0.5em;
      background: #ffffff;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 100;
      transition: all 0.2s ease;
    }

    .nav-button:hover:not(:disabled) {
      background: #f0f0f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .nav-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .prev-button {
      left: 10px;
    }

    .next-button {
      right: 10px;
    }

    /* Table of contents */
    .toc {
      margin-bottom: 2em;
    }

    .toc a {
      color: #0366d6;
      text-decoration: none;
      display: block;
      padding: 0.25em 0;
    }

    .toc a:hover {
      text-decoration: underline;
    }

    /* Slide styling */
    .slide-container {
      min-height: 80vh;
    }

    .slide {
      display: none;
    }

    .slide.active {
      display: block;
    }

    /* Style adjustments for slide content */
    .slide :global(.enlarged-text) {
      font-size: 3em;
    }

    .slide :global(td) {
      width: 400px;
      vertical-align: middle;
    }

    .slide :global(td img) {
      width: 100%;
      height: auto;
    }

    .slide :global(.slide-title-bottom) {
      text-align: right;
      padding-top: 20px;
      font-size: 1em;
    }

    .slide :global(h1) {
      display: none;
    }
  `;

  constructor() {
    super();
    this.slides = [];
    this.currentSlideIndex = 0;
    this.totalSlides = 0;
    this.urlArray = [];
    this.urlToIndexMap = {};
    
    // Bind methods to preserve 'this' context
    this.handleHashChange = this.handleHashChange.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    
    // Listen for hash changes and keyboard events
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('keydown', this.handleKeydown);
    
    // Initialize slides after component is connected
    this.initializeSlides();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this.handleHashChange);
    window.removeEventListener('keydown', this.handleKeydown);
  }

  initializeSlides() {
    // Find all slide elements in the document
    const slideElements = Array.from(document.querySelectorAll('.slide'));
    
    this.slides = slideElements.map((slide, index) => {
      // Check if slide has an existing ID, prioritize header-X format for TOC compatibility
      let slideId = slide.id;
      
      // If no ID exists, check if there's a header inside the slide
      if (!slideId) {
        const headerElement = slide.querySelector('h1, h2, h3, h4, h5, h6');
        if (headerElement && headerElement.id) {
          slideId = headerElement.id;
          slide.id = slideId; // Set the slide ID to match the header ID
        } else {
          // Generate header-X format to match TOC component
          slideId = `header-${index}`;
          slide.id = slideId;
          // Also set the header ID if it exists
          if (headerElement) {
            headerElement.id = slideId;
          }
        }
      }

      // Get the slide title from h2 element (or any header)
      const headerElement = slide.querySelector('h1, h2, h3, h4, h5, h6');
      const title = headerElement ? headerElement.textContent.trim() : `Slide ${index + 1}`;

      return {
        id: slideId,
        title: title,
        element: slide,
        index: index
      };
    });

    this.totalSlides = this.slides.length;

    // Build URL array and mapping
    this.buildUrlMapping();

    // Set initial slide based on URL hash or default to first slide
    this.setInitialSlide();
    
    // Hide all slides initially
    this.hideAllSlides();
    
    // Show the current slide
    this.showCurrentSlide();
    
    // Generate table of contents
    this.generateTOC();
    
    // Trigger re-render
    this.requestUpdate();
  }

  buildUrlMapping() {
    // Create URL array (index -> URL)
    this.urlArray = this.slides.map(slide => slide.id);
    
    // Create URL to index mapping (URL -> index)
    this.urlToIndexMap = {};
    this.slides.forEach((slide, index) => {
      this.urlToIndexMap[slide.id] = index;
    });
  }

  setInitialSlide() {
    const hash = window.location.hash.substring(1); // Remove the '#'
    
    if (hash && this.urlToIndexMap.hasOwnProperty(hash)) {
      this.currentSlideIndex = this.urlToIndexMap[hash];
      return;
    }
    
    // Default to first slide
    this.currentSlideIndex = 0;
    if (this.urlArray.length > 0) {
      this.updateURL(this.urlArray[0]);
    }
  }

  handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && this.urlToIndexMap.hasOwnProperty(hash)) {
      const newIndex = this.urlToIndexMap[hash];
      if (newIndex !== this.currentSlideIndex) {
        this.navigateToSlideByIndex(newIndex);
      }
    }
  }

  handleKeydown(event) {
    // Navigate with arrow keys
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.nextSlide();
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.prevSlide();
    }
  }

  navigateToSlideByIndex(slideIndex) {
    if (slideIndex < 0 || slideIndex >= this.totalSlides) {
      return;
    }

    this.currentSlideIndex = slideIndex;
    
    // Get URL from array
    const slideUrl = this.urlArray[slideIndex];
    
    // Update URL hash
    this.updateURL(slideUrl);
    
    // Show the slide
    this.hideAllSlides();
    this.showCurrentSlide();
    
    // Scroll to top
    window.scrollTo(0, 100);
    
    // Trigger re-render to update button states
    this.requestUpdate();
  }

  navigateToSlideByUrl(url) {
    if (this.urlToIndexMap.hasOwnProperty(url)) {
      const slideIndex = this.urlToIndexMap[url];
      this.navigateToSlideByIndex(slideIndex);
    }
  }

  updateURL(slideUrl) {
    // Update URL without triggering hashchange event
    const newURL = `${window.location.pathname}${window.location.search}#${slideUrl}`;
    window.history.replaceState(null, '', newURL);
  }

  hideAllSlides() {
    this.slides.forEach(slide => {
      slide.element.style.display = 'none';
      slide.element.classList.remove('active');
    });
  }

  showCurrentSlide() {
    if (this.slides[this.currentSlideIndex]) {
      const currentSlide = this.slides[this.currentSlideIndex];
      currentSlide.element.style.display = 'block';
      currentSlide.element.classList.add('active');
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      const nextIndex = this.currentSlideIndex + 1;
      const nextUrl = this.urlArray[nextIndex];
      this.updateURL(nextUrl);
      this.navigateToSlideByIndex(nextIndex);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      const prevIndex = this.currentSlideIndex - 1;
      const prevUrl = this.urlArray[prevIndex];
      this.updateURL(prevUrl);
      this.navigateToSlideByIndex(prevIndex);
    }
  }

  generateTOC() {
    // Find the outline element and populate it
    const outlineElement = document.getElementById('outline');
    if (outlineElement) {
      let tocHTML = '<p><a href="../">Previous Layer</a></p>';
      
      this.slides.forEach(slide => {
        tocHTML += `<p><a href="#${slide.id}" data-slide-url="${slide.id}">◇ ${slide.title}</a></p>`;
      });
      
      outlineElement.innerHTML = tocHTML;
      
      // Add click handlers for TOC links
      outlineElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.slideUrl) {
          e.preventDefault();
          const slideUrl = e.target.dataset.slideUrl;
          this.navigateToSlideByUrl(slideUrl);
        }
      });
    }
  }

  render() {
    if (this.totalSlides === 0) {
      return html`<p>No slides found. Add elements with class="slide" to your document.</p>`;
    }

    return html`
      <!-- Previous slide button -->
      <button 
        class="nav-button prev-button"
        @click=${this.prevSlide}
        ?disabled=${this.currentSlideIndex === 0}
        title="Previous slide (← key)"
      >
        ←
      </button>

      <!-- Next slide button -->
      <button 
        class="nav-button next-button"
        @click=${this.nextSlide}
        ?disabled=${this.currentSlideIndex === this.totalSlides - 1}
        title="Next slide (→ key)"
      >
        →
      </button>
    `;
  }
}

customElements.define('slides-component', SlidesComponent);