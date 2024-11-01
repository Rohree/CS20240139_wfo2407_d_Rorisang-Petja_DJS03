// Define the class for the book-preview component
export default class BookPreview extends HTMLElement {
    constructor() {
      super();
      // Attach a shadow DOM for encapsulation
      this.attachShadow({ mode: 'open' });
    }
  
    // Observed attributes that trigger re-render
    static get observedAttributes() {
      return ['title', 'author', 'image', 'description'];
    }
  
    // When an attribute changes, update the component's content
    attributeChangedCallback() {
      this.render();
    }
  
    // Define the HTML structure and styling of the component
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          .preview {
            display: flex;
            border: 1px solid #ccc;
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
          }
          .preview img {
            width: 60px;
            height: 90px;
            object-fit: cover;
            margin-right: 10px;
          }
          .preview__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          .preview__title {
            font-size: 1.1rem;
            font-weight: bold;
            margin: 0;
          }
          .preview__author {
            font-size: 0.9rem;
            color: #555;
          }
        </style>
        <div class="preview" role="button">
          <img src="${this.getAttribute('image')}" alt="Book cover of ${this.getAttribute('title')}">
          <div class="preview__info">
            <h3 class="preview__title">${this.getAttribute('title')}</h3>
            <p class="preview__author">${this.getAttribute('author')}</p>
          </div>
        </div>
      `;
  
      // Add an event listener for clicks to open the full book preview
      this.shadowRoot.querySelector('.preview').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('preview-click', {
          detail: { id: this.getAttribute('book-id') },
          bubbles: true,
          composed: true
        }));
      });
    }
  }
  
  // Register the component
  customElements.define('book-preview', BookPreview);
  