/**  The controller acts as an intermediary between the model and the view. It processes
user input, interacts with the model to update the data, and updates the view accordingly. **/

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Run initial code setup
    this.initSetup();
  }

  handleSearchInput = async (e) => {
    try {
      // Get the search query from the input field and trim any leading or trailing whitespace
      const searchQuery = e.target.value.trim();

      // Check if the search query is not empty
      if (searchQuery) {
        // Show a loading indicator while searching
        this.view.showLoader(
          `<i class="icon fa-solid fa-magnifying-glass"></i> Searching...`
        );

        // Fetch books data based on the search query
        await this.model.fetchBooksData(searchQuery);

        // Retrieve the list of books from the model
        const books = this.model.getBooks();

        // Hide the loading indicator once the data is fetched
        this.view.hideLoader();

        // Display the fetched books to the user
        this.view.showBooks(books);
      } else {
        // If the search query is empty, hide the books display
        this.view.hideBooks();
      }
    } catch (error) {
      // Log any errors that occur during the process
      console.log(error.message);
    }
  };

  handleDebounce = (func, delay) => {
    // Declare a variable to store the timeout ID
    let timeout;

    // Return a new function that will be executed when called
    return (...args) => {
      // Clear any previously set timeout to reset the debounce timer
      clearTimeout(timeout);

      // Set a new timeout that will execute the provided function after the delay
      timeout = setTimeout(() => {
        // Use 'apply' to call the function with the correct 'this' context and pass in the arguments
        func.apply(this, args);
      }, delay);
    };
  };

  handleSelectBook = async (e) => {
    // Find the closest book element clicked, using event delegation
    const target = e.target.closest(".book");

    // If no book element is found, exit the function
    if (!target) return;

    try {
      // Find the selected book in the model using its data ID
      const book = this.model.findBook(target.dataset.id);

      // Show a loader message while generating the book summary and key takeaways
      this.view.showLoader(
        `<i class="icon fa-solid fa-bolt-lightning"></i> Generating summary and key takeaways for <b>${book.title}</b>...`
      );

      // Fetch and set the summary for the selected book
      await this.model.setSummary(book);

      // Hide the loader once the summary is generated
      this.view.hideLoader();

      // Get the generated summary from the model
      const summary = this.model.getSummary();

      // Display the summary in a modal, passing relevant functions for hiding the modal,
      // toggling bookmarks, and checking if the book is bookmarked
      this.view.showModal(
        summary,
        this.view.hideModal,
        this.handleToggleBookmark,
        this.model.findBookmark
      );
    } catch (error) {
      // Log any errors that occur during the process
      console.log(error.message);
    }
  };

  handleToggleBookmark = (summary) => {
    // Check if the summary is already bookmarked by searching in the model
    const isBookmarked = this.model.findBookmark(summary.id);

    // If the summary is not bookmarked, add it to the bookmarks
    if (!isBookmarked) {
      this.model.addBookmark(summary);
    } else {
      // If the summary is already bookmarked, remove it from the bookmarks
      this.model.removeBookmark(summary.id);

      // Update the view to display the current list of bookmarks after removal
      this.view.showBookmarks(this.model.getBookmarks());
    }
  };

  handleClickBookmarks = () => {
    const bookmarks = this.model.getBookmarks();
    this.view.showBookmarks(bookmarks);
  };

  handleSelectBookmark = (e) => {
    // Listen to the parent element but only select the element with .bookmarks__image class
    const target = e.target.closest(".bookmarks__image");
    if (!target) return;

    // Get the id from the element's data attribute
    const id = target.dataset.id;

    // Get all bookmarks from the local state
    const bookmarks = this.model.getBookmarks();

    // Find the bookmark using the id
    const bookmark = bookmarks.find((b) => b.id === id);

    // Show the bookmarked summary modal
    this.view.showModal(
      bookmark,
      this.view.hideModal,
      this.handleToggleBookmark,
      this.model.findBookmark
    );
  };

  handleDarkMode = () => {
    this.model.toggleDarkMode();
    this.view.toggleDarkMode(this.model.getDarkMode());
  };

  initSetup() {
    // Initial dark mode preference
    const darkModePreference = this.model.getDarkMode() || "disabled";
    this.view.toggleDarkMode(darkModePreference);

    // Input Listener
    this.view.input.addEventListener(
      "input",
      this.handleDebounce(this.handleSearchInput, 300)
    );

    // Book Listener
    this.view.main.addEventListener("click", this.handleSelectBook);
    this.view.main.addEventListener("click", this.handleSelectBookmark);

    // Bookmarks Listener
    this.view.allBookmarksButton.addEventListener(
      "click",
      this.handleClickBookmarks
    );

    // Dark Mode Listener
    this.view.darkModeButton.addEventListener("click", this.handleDarkMode);
  }
}
