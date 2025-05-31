// File: cdn/slides-component.js
//
// A standalone Lit 3 component that handles slide presentation functionality.
// Scans for <div class="slide"> elements and provides navigation with URL hash support.
// Uses URL hash (#section) as the single source of truth for current slide state.

import { LitElement, html, css } from 'https://unpkg.com/lit@3?module';

class SlidesComponent extends LitElement {
  static properties = {
    slides: { type: Array },
    currentSlideIndex: { type: Number },
    totalSlides: { type: Number }
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
      // Generate a unique ID if not present
      let slideId = slide.id;
      if (!slideId) {
        slideId = `slide-${index}`;
        slide.id = slideId;
      }

      // Get the slide title from h2 element
      const h2Element = slide.querySelector('h2');
      const title = h2Element ? h2Element.textContent.trim() : `Slide ${index + 1}`;

      return {
        id: slideId,
        title: title,
        element: slide,
        index: index
      };
    });

    this.totalSlides = this.slides.length;

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

  setInitialSlide() {
    const hash = window.location.hash.substring(1); // Remove the '#'
    
    if (hash) {
      const slideIndex = this.slides.findIndex(slide => slide.id === hash);
      if (slideIndex !== -1) {
        this.currentSlideIndex = slideIndex;
        return;
      }
    }
    
    // Default to first slide
    this.currentSlideIndex = 0;
    if (this.slides.length > 0) {
      this.updateURL(this.slides[0].id);
    }
  }

  handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const slideIndex = this.slides.findIndex(slide => slide.id === hash);
      if (slideIndex !== -1 && slideIndex !== this.currentSlideIndex) {
        this.navigateToSlide(slideIndex);
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

  navigateToSlide(slideIndex) {
    if (slideIndex < 0 || slideIndex >= this.totalSlides) {
      return;
    }

    this.currentSlideIndex = slideIndex;
    const slide = this.slides[slideIndex];
    
    // Update URL hash
    this.updateURL(slide.id);
    
    // Show the slide
    this.hideAllSlides();
    this.showCurrentSlide();
    
    // Scroll to top
    window.scrollTo(0, 100);
    
    // Trigger re-render to update button states
    this.requestUpdate();
  }

  updateURL(slideId) {
    // Update URL without triggering hashchange event
    const newURL = `${window.location.pathname}${window.location.search}#${slideId}`;
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
      this.navigateToSlide(this.currentSlideIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.navigateToSlide(this.currentSlideIndex - 1);
    }
  }

  generateTOC() {
    // Find the outline element and populate it
    const outlineElement = document.getElementById('outline');
    if (outlineElement) {
      let tocHTML = '<p><a href="../">Previous Layer</a></p>';
      
      this.slides.forEach(slide => {
        tocHTML += `<p><a href="#${slide.id}" data-slide-id="${slide.id}">◇ ${slide.title}</a></p>`;
      });
      
      outlineElement.innerHTML = tocHTML;
      
      // Add click handlers for TOC links
      outlineElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.dataset.slideId) {
          e.preventDefault();
          const slideId = e.target.dataset.slideId;
          const slideIndex = this.slides.findIndex(slide => slide.id === slideId);
          if (slideIndex !== -1) {
            this.navigateToSlide(slideIndex);
          }
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