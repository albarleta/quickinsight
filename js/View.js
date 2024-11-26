/** The view is the user interface (UI) of the application. 
It displays the data provided by the model and allows users to interact with the app. **/
export class View {
  constructor() {
    this.body = document.body;
    this.input = document.querySelector(".input");
    this.main = document.querySelector(".main");
    this.homeButton = document.querySelector("#home");
    this.allBookmarksButton = document.querySelector("#bookmarks");
    this.darkModeButton = document.querySelector("#dark-mode");
  }

  showBooks = (books) => {
    this.main.style.display = "grid";
    this.main.innerHTML = books.map((book) => this.renderBook(book)).join("");
  };

  renderBook = (book) => {
    return `<div class="book" data-id="${book.id}">
              <img class="book__cover" src="${book.image}" alt="${book.title}" />
              <div class="book__details">
                <h3 class="book__title">${book.title}</h3>
                <p class="book__author">${book.author}</p>
                <span class="book__category">${book.category}</span>
              </div>
            </div>`;
  };

  hideBooks = () => {
    this.main.innerHTML = "";
  };

  showLoader = (message) => {
    const loaderHTML = `
      <div class="modal modal--loader modal--active">
        <div class="modal__card card">
          <div class="modal__header">
            <h2 class="modal__title">${message}</h2>
  
          </div>
        </div>
      </div>`;

    const loaderWrapper = document.createElement("div");
    loaderWrapper.innerHTML = loaderHTML;

    this.body.appendChild(loaderWrapper.firstElementChild);
  };

  hideLoader = () => {
    const loader = document.querySelector(".modal--loader");
    if (loader) {
      loader.remove();
    }
  };

  showModal = (summary, hideModal, toggleBookmark, findBookmark) => {
    const modalHTML = `<div class="modal modal--active">
                          <div class="modal__card card">
                            <div class="modal__header">
                              <h2 class="modal__title">${summary.title}</h2>
                              <i class="icon modal__close fa-solid fa-circle-xmark"></i>
                            </div>

                            <div class="modal__body">
                              <div class="modal__content">
                                <header class="header">
                                  <i class="icon fa-solid fa-book"></i>
                                  <h3 class="heading">Summary:</h3>
                                </header>

                                <p class="modal__summary">
                                  ${summary.summary}
                                </p>
                              </div>

                              <div class="modal__content">
                                <header class="header">
                                  <i class="icon fa-solid fa-star"></i>
                                  <h3 class="heading">Key Takeaways:</h3>
                                </header>

                                <ol class="list modal__key-takeaways">
                                  ${summary.takeAways
                                    .map(
                                      (t) => `<li class="list__item">${t}</li>`
                                    )
                                    .join("")}
                        
                                </ol>
                              </div>
                              <button class="button">
                                <i class="icon fa-solid fa-bookmark"></i><span>${
                                  findBookmark(summary.id)
                                    ? "Remove from bookmarks"
                                    : "Add to bookmarks"
                                }</span>
                              </button>
                            </div>
                          </div>
                        </div>`;

    const loaderWrapper = document.createElement("div");
    loaderWrapper.innerHTML = modalHTML;
    this.body.appendChild(loaderWrapper.firstElementChild);

    const closeButton = document.querySelector(".modal__close");
    closeButton.onclick = hideModal;

    const bookmarkButton = document.querySelector(".button");
    bookmarkButton.addEventListener("click", () => {
      toggleBookmark(summary);
      hideModal();
    });
  };

  hideModal = () => {
    const loader = document.querySelector(".modal");
    if (loader) {
      loader.remove();
    }
  };

  showBookmarks = (bookmarks) => {
    this.main.style.display = "block";
    const bookmarksHTML = `<div class="bookmarks">
                             <header class="header">
                              <i class="icon fa-solid fa-bookmark"></i>
                              <h2 class="heading">${
                                bookmarks.length > 1 ? "Bookmarks" : "Bookmark"
                              } (${bookmarks.length})</h2>
                            </header>
                              <div class="bookmarks__list">
                                ${bookmarks
                                  .map(
                                    (b) =>
                                      `<img class="bookmarks__image" src="${b.image}" alt="book cover" data-id="${b.id}"/>`
                                  )
                                  .join("")}
                              </div>
                          </div>`;
    this.main.innerHTML = bookmarksHTML;
  };

  toggleDarkMode(darkModePreference) {
    if (darkModePreference === "enabled") {
      this.body.classList.add("dark-mode");
    } else {
      this.body.classList.remove("dark-mode");
    }
  }
}
