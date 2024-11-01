# Book List Application

This application displays a list of books with functionality to filter by genre, author, and title, load more items, switch between day/night themes, and preview book details. It is built with JavaScript and follows SOLID principles to maintain a clean, scalable, and maintainable codebase.

## Features

- **Display Books**: Shows a list of books with their title, author, and cover image.
- **Filter**: Users can filter books by genre, author, or title.
- **Load More**: Loads additional books in increments defined by `BOOKS_PER_PAGE`.
- **Theme Toggle**: Automatically sets day or night mode based on user preferences and allows manual adjustments.
- **Book Preview**: When a book is clicked, a preview modal opens with additional book details, including the cover image, title, author, and description.

## Code Structure and SOLID Principles

The application has been refactored to apply the SOLID principles. Here’s a breakdown of how each principle is applied:

### 1. Single Responsibility Principle (SRP)

The code has been divided into distinct modules, each handling a single responsibility:
- **`BookUI`**: Manages the rendering of book elements, filter options, and book previews.
- **`Filter`**: Handles the filtering logic based on genre, author, and title.
- **`DOMHelper`**: Provides helper methods for DOM manipulation, like toggling overlays and updating button states.
- **`EventListeners`**: Sets up event listeners for user actions such as opening overlays, submitting forms, and loading more books.

Each of these modules has a specific role, making the code easier to understand, test, and maintain.

### 2. Open/Closed Principle (OCP)

The code is open to extension but closed to modification. New functionality, like additional filter criteria or themes, can be added by extending the `Filter` or `DOMHelper` modules without modifying the core structure. For example, the `Filter` module could be extended to add search options without altering existing filter logic.

### 3. Liskov Substitution Principle (LSP)

The functions within each module are designed to work independently and can be replaced or extended without affecting other parts of the application. For example, the `BookUI.renderBooks()` method can display any list of book objects without requiring changes to how books are filtered or loaded.

### 4. Interface Segregation Principle (ISP)

The modular approach allows functions to only use the methods they need without being forced to rely on unnecessary methods. This keeps each module focused and prevents bloated classes or functions. For example, the `Filter` module only contains methods for filtering logic, and `BookUI` handles only UI-related tasks.

### 5. Dependency Inversion Principle (DIP)

High-level modules (e.g., `initializeApp`) do not depend on low-level modules; instead, they interact with each helper module through defined functions. For instance, `initializeApp` calls functions from `EventListeners` and `BookUI` without directly manipulating DOM elements. This keeps dependencies minimal and the code flexible.

## Updated File Structure and Explanation

### `UISelectors`

Defines common selectors to keep code concise and consistent. These selectors are used throughout `DOMHelper`, `BookUI`, and `EventListeners` to access specific DOM elements, ensuring that selector strings are only defined once.

### `DOMHelper`

Handles general DOM manipulation tasks, such as setting themes, toggling overlays, and updating button states. This keeps UI updates separated from business logic.

### `EventListeners`

Registers all event listeners for user actions, including opening overlays, canceling searches, submitting forms, and loading more items. It separates event handling logic from UI rendering, improving modularity and readability.

### `Filter`

Processes search filters applied to the book list. It checks for matches on genre, author, and title, updating the book list and rendering only the matched results. Filtering logic is encapsulated within this module to keep `BookUI` focused on rendering.

### `BookUI`

Contains methods for:
- **Rendering Books**: Displays the books in increments of `BOOKS_PER_PAGE`.
- **Setup Filters**: Initializes filter options for genres and authors.
- **Handling Book Clicks**: Listens for clicks on book elements and triggers the preview.
- **Preview Book**: Displays a detailed modal with the selected book's information.

This modular structure promotes adherence to SOLID principles, enhances readability, and allows easy modification or extension of individual components.

---

## Installation

1. Clone this repository.
2. Ensure that the `data.js` file is in the same directory, containing `books`, `authors`, `genres`, and `BOOKS_PER_PAGE` variables.
3. Open `index.html` in a browser to view the application.

## Usage

1. **View Book List**: The main page shows a list of available books.
2. **Filter**: Use the dropdowns and search bar to narrow down results.
3. **Preview a Book**: Click on a book to view more details in a modal pop-up.
4. **Load More**: Click "Show More" to load additional books.
5. **Change Theme**: Use the settings menu to toggle between day and night themes.

This codebase follows best practices for maintainable, scalable JavaScript development, and the modular approach ensures easy adjustments or enhancements in the future.
