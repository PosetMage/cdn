// File: cdn/sidebar-component.js
//
// A standalone Lit 3 component that wraps <table-of-contents> in a sliding sidebar.
// The sidebar is 200px wide, initially off-screen to the left (-200px).
// Clicking "☰" slides it in; clicking "«" slides it back out.
// Fixed to provide seamless integration with TOC component.

import { LitElement, html, css } from 'https://unpkg.com/lit@3?module';
import './toc-component.js'; // Adjust path if necessary

class SidebarComponent extends LitElement {
  static properties = {
    open: { type: Boolean }
  };

  static styles = css`
    :host {
      display: block;
    }

    /* ☰ Open Button - Fixed overlay at top-left */
    .open-button {
      position: fixed;
      top: 5px;
      left: 5px;
      background: #ffffff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0.5em 0.75em;
      cursor: pointer;
      font-size: 1em;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 10;
      transition: all 0.2s ease;
    }

    .open-button:hover {
      background: #f0f0f0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    /* Hide open button when sidebar is open */
    .open-button.hidden {
      opacity: 0;
      pointer-events: none;
    }

    /* Sliding sidebar panel */
    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 200px;
      height: 100vh;
      background-color: #fff;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
      /* Start off-screen: shift left by exactly 200px */
      transform: translateX(-200px);
      transition: transform 0.3s ease-in-out;
      display: flex;
      flex-direction: column;
      z-index: 10;
    }
    
    .sidebar.open {
      transform: translateX(0);
    }

    /* « Close Button inside sidebar */
    .close-button {
      align-self: flex-end;
      background: #ffffff;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 0.25em 0.5em;
      margin: 0.5em;
      cursor: pointer;
      font-size: 1.2em;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .close-button:hover {
      background: #f0f0f0;
    }

    /* Container for the TOC - seamless integration */
    .toc-container {
      flex: 1;
      overflow-y: auto;
      padding: 0.5em 1em 1em 1em;
    }

    /* Style the TOC component when inside sidebar */
    table-of-contents {
      width: 100%;
    }
  `;

  constructor() {
    super();
    this.open = false;
  }

  toggleSidebar() {
    this.open = !this.open;
  }

  render() {
    return html`
      <!-- Fixed overlay open button (only visible when sidebar is closed) -->
      <button 
        class="open-button ${this.open ? 'hidden' : ''}" 
        @click=${this.toggleSidebar} 
        title="Open table of contents"
      >
        ☰
      </button>

      <!-- Sidebar panel (slides in/out) -->
      <div class="sidebar ${this.open ? 'open' : ''}">
        <!-- Close button inside sidebar -->
        <button class="close-button" @click=${this.toggleSidebar} title="Close sidebar">
          «
        </button>
        <!-- TOC container for seamless integration -->
        <div class="toc-container">
          <table-of-contents></table-of-contents>
        </div>
      </div>
    `;
  }
}

customElements.define('sidebar-component', SidebarComponent);