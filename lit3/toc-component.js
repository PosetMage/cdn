// =================================================================================
// File: cdn/toc-component.js
// A standalone Lit 3 component that scans the document for <h1>–<h6>, assigns unique IDs,
// and renders a nested <ul> of links reflecting the heading hierarchy.
// Import Lit 3 from a CDN—no build tools needed.
// =================================================================================

import { LitElement, html, css } from 'https://unpkg.com/lit@3?module';

class TableOfContents extends LitElement {
  static properties = {
    // An array representing the root nodes of the heading tree.
    tocTree: { type: Array }
  };

  static styles = css`
    :host {
      display: block;
      border: 1px solid #ccc;
      padding: 1em;
      background-color: #f9f9f9;
      font-family: Arial, sans-serif;
    }

    nav {
      max-width: 100%;
    }

    /* Reset default bullets; add consistent indentation */
    ul {
      list-style: none;
      margin: 0;
      padding-left: 1em;
    }

    li {
      margin: 0.2em 0;
    }

    a {
      color: #0366d6;
      text-decoration: none;
      font-size: 0.9em;
    }

    a:hover {
      text-decoration: underline;
    }
  `;

  constructor() {
    super();
    // Initialize the TOC tree as empty; will be populated in firstUpdated()
    this.tocTree = [];
  }

  /**
   * Once the component is connected and rendered, scan the entire document
   * for <h1>–<h6>, assign each a unique ID (if missing), then build a nested tree.
   */
  firstUpdated() {
    // 1) Select all headings (h1..h6) in document order.
    const headers = Array.from(
      document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    ).map((header, index) => {
      // If the heading already has an ID, keep it; otherwise generate one.
      let id = header.id;
      if (!id) {
        id = `heading-${index + 1}`;
        header.id = id;
      }

      return {
        id,
        text: header.innerText.trim(),
        level: parseInt(header.tagName.substring(1), 10), // 1 for H1, 2 for H2, etc.
        children: [] // Will fill in based on hierarchy
      };
    });

    // 2) Convert the flat list of headings into a nested tree.
    this.tocTree = this._buildTree(headers);

    // 3) Trigger an update so render() will be called.
    this.requestUpdate();
  }

  /**
   * Given a flat, ordered array of items with .level (1–6), build a nested tree.
   * Uses a stack: each new heading is nested under the last heading of a lower level.
   */
  _buildTree(items) {
    const root = [];
    const stack = [];

    items.forEach(item => {
      // Pop from the stack until we find an item whose level is less than the new item’s level.
      while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
        stack.pop();
      }

      // If stack is empty, this is a top-level heading → push into root.
      if (stack.length === 0) {
        root.push(item);
      } else {
        // Otherwise, it’s a child of the current “top” of the stack.
        stack[stack.length - 1].children.push(item);
      }

      // Push the current item onto the stack for future nesting.
      stack.push(item);
    });

    return root;
  }

  /**
   * Recursively render a nested list of headings as <ul> / <li> / <a> links.
   */
  _renderTree(nodes) {
    return html`
      <ul>
        ${nodes.map(node => html`
          <li>
            <a href="#${node.id}">${node.text}</a>
            ${node.children.length > 0
              ? this._renderTree(node.children)
              : ''}
          </li>
        `)}
      </ul>
    `;
  }

  render() {
    // If no headings were found, show a friendly message.
    if (!this.tocTree || this.tocTree.length === 0) {
      return html`<p>No headings found in the document.</p>`;
    }

    // Otherwise, render the nested TOC.
    return html`
      <nav>
        ${this._renderTree(this.tocTree)}
      </nav>
    `;
  }
}

// Register the custom element as <table-of-contents>
customElements.define('table-of-contents', TableOfContents);