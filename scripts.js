import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
import "./BookFilter.js"
import "./BookPreview.js"


// Constants and initial values
let page = 1;
let matches = books;
const UISelectors = {
    listItems: '[data-list-items]',
    searchGenres: '[data-search-genres]',
    searchAuthors: '[data-search-authors]',
    settingsTheme: '[data-settings-theme]',
    listButton: '[data-list-button]',
    listMessage: '[data-list-message]',
    searchOverlay: '[data-search-overlay]',
    settingsOverlay: '[data-settings-overlay]',
    listActive: '[data-list-active]',
    listClose: '[data-list-close]',
    listBlur: '[data-list-blur]',
    listImage: '[data-list-image]',
    listTitle: '[data-list-title]',
    listSubtitle: '[data-list-subtitle]',
    listDescription: '[data-list-description]',
    searchTitle: '[data-search-title]'
};

// DOM Manipulation functions
const DOMHelper = {
    /**
     * Sets the theme of the application based on the specified mode.
     * 
     * This function updates the CSS custom properties for dark and light mode
     * colors. It modifies the values of `--color-dark` and `--color-light` 
     * based on whether dark mode is enabled or not. 
     * 
     * @param {boolean} isDarkMode - A flag indicating whether to set dark mode (true) 
     * or light mode (false).
     */
    setTheme: (isDarkMode) => {
        document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
    },

    /**
     * Toggles the visibility of an overlay element.
     * 
     * This function sets the `open` property of the overlay element specified by the 
     * given selector. If `open` is true, the overlay is displayed; if false, it is hidden.
     * 
     * @param {string} selector - The CSS selector for the overlay element.
     * @param {boolean} open - A flag indicating whether to open (true) or close (false) the overlay.
     */
    toggleOverlay: (selector, open) => {
        document.querySelector(selector).open = open;
    },


    /**
     * Updates the state and display of the "Load More" button.
     * 
     * This function enables or disables the "Load More" button based on the number of
     * remaining items. If there are no remaining items, the button is disabled; otherwise,
     * it is enabled and displays the number of items left to show.
     * 
     * @param {number} remaining - The number of items remaining to be displayed.
     */
    updateButtonState: (remaining) => {
        document.querySelector(UISelectors.listButton).disabled = remaining < 1;
        document.querySelector(UISelectors.listButton).innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${remaining})</span>
        `;
    }
};

// Event Listeners
const EventListeners = {
    /**
     *  Initializes event listeners for various UI elements.
     */
    setup: () => {
        // Adds a click event to close the search overlay
        document.querySelector('[data-search-cancel]').addEventListener('click', () => DOMHelper.toggleOverlay(UISelectors.searchOverlay, false));
        // Adds a click event to close the settings overlay
        document.querySelector('[data-settings-cancel]').addEventListener('click', () => DOMHelper.toggleOverlay(UISelectors.settingsOverlay, false));
        // Adds a click event to open the search overlay and focus on the search input
        document.querySelector('[data-header-search]').addEventListener('click', () => {
            DOMHelper.toggleOverlay(UISelectors.searchOverlay, true);
            document.querySelector(UISelectors.searchTitle).focus();
        });
         // Adds a click event to open the settings overlay
        document.querySelector('[data-header-settings]').addEventListener('click', () => DOMHelper.toggleOverlay(UISelectors.settingsOverlay, true));
         // Adds a click event to close the active list overlay
        document.querySelector(UISelectors.listClose).addEventListener('click', () => DOMHelper.toggleOverlay(UISelectors.listActive, false));
         // Adds a click event for handling clicks on book items
         document.querySelector(UISelectors.listItems).addEventListener('preview-click', (event) => {
            const bookId = event.detail.id;
            const book = books.find(b => b.id === bookId);
            if (book) {
              BookUI.previewBook(book); // Calls the function to preview the selected book
            }
          });
    },

    /** 
    * This function listens for the submit event on the settings form and prevents
    * the default behavior. It retrieves the theme selection from the form data,
    * sets the theme based on the user's choice, and hides the settings overlay.
     */
    settingsFormSubmit: () => {
        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);
            DOMHelper.setTheme(theme === 'night');
            DOMHelper.toggleOverlay(UISelectors.settingsOverlay, false);
        });
    },

    /**
     * uses form data to searches database using search(formd-ata)
     */
    searchFormSubmit: () => {
        document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const filters = Object.fromEntries(formData);
            Filter.search(filters);
        });
    },

    /**
     * Initializes the "Load More" button to display additional book items.
     * 
     * This function listens for clicks on the "Load More" button, loads the next
     * set of books based on the current page and books per page, and updates the button
     * state to reflect whether more books are available to load.
     */
    loadMoreButton: () => {
        document.querySelector(UISelectors.listButton).addEventListener('click', () => {
            BookUI.renderBooks(matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE));
            page += 1;
            DOMHelper.updateButtonState(matches.length - (page * BOOKS_PER_PAGE));
        });
    }
};

// Filter functions
const Filter = {
    /** 
    * This function takes a set of filter criteria (genre, title, author) and filters
    * the `books` list to match the specified filters. It then resets the page number,
    * updates the displayed list of books, and manages the UI elements like the search
    * message and load more button state.
    * 
    * @param {Object} filters - The search criteria to filter books.
    * 
    */
    search: (filters) => {
        const result = books.filter(book => {
            const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
            const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
            const authorMatch = filters.author === 'any' || book.author === filters.author;
            return genreMatch && titleMatch && authorMatch;
        });

        page = 1;
        matches = result;
        document.querySelector(UISelectors.listItems).innerHTML = '';
        BookUI.renderBooks(result.slice(0, BOOKS_PER_PAGE));

        if (result.length < 1) {
            document.querySelector(UISelectors.listMessage).classList.add('list__message_show');
        } else {
            document.querySelector(UISelectors.listMessage).classList.remove('list__message_show');
        }
        DOMHelper.updateButtonState(matches.length - BOOKS_PER_PAGE);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        DOMHelper.toggleOverlay(UISelectors.searchOverlay, false);
    }
};

// Book UI Functions
const BookUI = {
    
    /**
    * Renders a list of book preview buttons to the UI.
    * 
    * This function creates and appends button elements for each book in the provided
    * array. Each button includes the book's image, title, and author. The buttons are 
    * added to the document in a single operation using a document fragment for performance.
    * 
    * @param {Array} booksToRender - An array of book objects to be rendered. 
    */
    renderBooks: (booksToRender) => {
        const fragment = document.createDocumentFragment();
        for (const { author, id, image, title } of booksToRender) {
            const element = document.createElement('book-preview');
            element.setAttribute('book-id', id);
            element.setAttribute('title', title);
            element.setAttribute('author', authors[author]);
            element.setAttribute('image', image);
            fragment.appendChild(element);
        }
        document.querySelector(UISelectors.listItems).appendChild(fragment);
    },


    /**
     * Sets up the filter options for genres and authors in the search interface.
     * 
     * This function generates HTML for the genre and author selection elements 
     * using the `createOptions` method from `BookUI`. It appends the generated 
     * options to the respective filter elements in the UI, allowing users to filter 
     * books by genre and author.
     */
    setupFilters: () => {
        const genreHtml = BookUI.createOptions('All Genres', genres);
        document.querySelector(UISelectors.searchGenres).appendChild(genreHtml);
        
        const authorHtml = BookUI.createOptions('All Authors', authors);
        document.querySelector(UISelectors.searchAuthors).appendChild(authorHtml);
    },

    /**
     * Creates a set of <option> elements for a select dropdown.
     * 
     * This function generates a document fragment containing option elements based on
     * the provided data. It first adds a default option, and then iterates over the data 
     * to create options for each entry. The resulting fragment is returned for appending 
     * to a select element.
     * 
     * @param {string} defaultText - The text for the default option that allows 
     * users to choose 'any' selection.
     * @param {Object} data - An object containing key-value pairs where the key 
     * is the option value and the value is the display name.
     * @returns {DocumentFragment} A fragment containing the created option elements.
     */
    createOptions: (defaultText, data) => {
        const fragment = document.createDocumentFragment();
        const firstOption = document.createElement('option');
        firstOption.value = 'any';
        firstOption.innerText = defaultText;
        fragment.appendChild(firstOption);

        for (const [id, name] of Object.entries(data)) {
            const option = document.createElement('option');
            option.value = id;
            option.innerText = name;
            fragment.appendChild(option);
        }
        return fragment;
    },

    /**
     * Handles the click event on book preview buttons.
     * 
     * This function checks if the clicked element is a button with a `data-preview` 
     * attribute. If it is, the function retrieves the book ID from the attribute, 
     * finds the corresponding book in the `books` array, and calls the `previewBook` 
     * method of the `BookUI` to display the selected book's details.
     * 
     * @param {Event} event - The click event triggered by the user.
     */
    handleBookClick: (event) => {
        const target = event.target.closest('button[data-preview]');
        if (!target) return;
        const bookId = target.getAttribute('data-preview');
        const book = books.find(b => b.id === bookId);
        if (book) BookUI.previewBook(book);
    },

    /**
     * Displays a preview of the selected book in the UI.
     * 
     * This function takes a book object and updates various UI elements to 
     * show the book's details, including its image, title, author, publication 
     * year, and description. It also ensures that the overlay containing the 
     * book preview is opened for the user to view.
     * 
     * @param {Object} book - The book object containing details to be displayed.
     */
    previewBook: (book) => {
        document.querySelector(UISelectors.listActive).open = true;
        document.querySelector(UISelectors.listBlur).src = book.image;
        document.querySelector(UISelectors.listImage).src = book.image;
        document.querySelector(UISelectors.listTitle).innerText = book.title;
        document.querySelector(UISelectors.listSubtitle).innerText = `${authors[book.author]} (${new Date(book.published).getFullYear()})`;
        document.querySelector(UISelectors.listDescription).innerText = book.description;
    }
};

// Initial Render and Setup
const initializeApp = () => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    DOMHelper.setTheme(isDarkMode);

    BookUI.renderBooks(matches.slice(0, BOOKS_PER_PAGE));
    BookUI.setupFilters();

    EventListeners.setup();
    EventListeners.settingsFormSubmit();
    EventListeners.searchFormSubmit();
    EventListeners.loadMoreButton();

    document.querySelector(UISelectors.listButton).innerText = `Show more (${books.length - BOOKS_PER_PAGE})`;
    DOMHelper.updateButtonState(matches.length - BOOKS_PER_PAGE);
};

initializeApp();
