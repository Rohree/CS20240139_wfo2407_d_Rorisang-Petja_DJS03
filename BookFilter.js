// BookFilter.js
class BookFilter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.render();
      this.shadowRoot.querySelector('form').addEventListener('submit', this.handleSubmit.bind(this));
    }
  
    disconnectedCallback() {
      this.shadowRoot.querySelector('form').removeEventListener('submit', this.handleSubmit.bind(this));
    }
  
    handleSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const filters = {
        genre: formData.get('genre') || 'any',
        author: formData.get('author') || 'any',
        title: formData.get('title') || ''
      };
  
      // Dispatch custom event with the filters data
      this.dispatchEvent(new CustomEvent('filter-books', {
        detail: filters,
        bubbles: true,
        composed: true
      }));
    }
  
    render() {
      this.shadowRoot.innerHTML = `
        <style>
          /* Styles for the filter form */
          .filter-form {
            display: flex;
            gap: 8px;
          }
        </style>
        <form class="filter-form">
          <select name="genre">
            <option value="any">All Genres</option>
            ${Object.entries(genres).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
          </select>
          <select name="author">
            <option value="any">All Authors</option>
            ${Object.entries(authors).map(([id, name]) => `<option value="${id}">${name}</option>`).join('')}
          </select>
          <input type="text" name="title" placeholder="Search by title">
          <button type="submit">Search</button>
        </form>
      `;
    }
  }
  
  customElements.define('book-filter', BookFilter);
  export default BookFilter;
  