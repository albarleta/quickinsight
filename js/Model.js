/** The model is responsible for the data logic of the application. It interacts 
with the database, performs data manipulations, and handles business logic **/

import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = atob("QUl6YVN5QXREYUlwU0pUano4V1JMT011RFRZb1F4d2Z5WTZ0eUdn");

export class Model {
  constructor() {
    this.state = {
      books: [],
      summary: {},
    };

    // Initialize Google Gemini AI
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.genModel = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });
  }

  fetchBooksData = async (query) => {
    try {
      // Fetch data from Google books API
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
      );
      const data = await res.json();

      // Create books array with id, title, author, image, category properties
      const books = data.items.map((book) => {
        const id = book.id || crypto.randomUUID();
        const title = book.volumeInfo.title;
        const author = book.volumeInfo?.authors
          ? book.volumeInfo.authors[0]
          : "n/a";
        const image =
          book.volumeInfo?.imageLinks?.thumbnail || "images/placeholder.png";
        const category = book.volumeInfo?.categories
          ? book.volumeInfo.categories[0]
          : "n/a";

        return { id, title, image, author, category };
      });

      // Store the books in the local state
      this.state.books = books;
    } catch (error) {
      console.log(error.message);
    }
  };

  getBooks = () => {
    return this.state.books;
  };

  findBook = (id) => {
    return this.state.books.find((book) => book.id === id);
  };

  setSummary = async (book) => {
    try {
      // Create a prompt to generate a summary and key takeaways for the given book using AI
      const prompt = `Create a concise summary of the book ${book.title} by ${book.author} that provides a comprehensive overview of the book's themes, arguments, and important chapters.
    The summary should give the reader a solid grasp of the book's core message and content, allowing them to make an informed decision on whether to read it.
    Additionally, provide 10 key bullet points that capture the most critical information and insights from the entire book, ensuring nothing significant is missed.
    The bullet points should highlight the essential ideas, key arguments, and actionable takeaways that encapsulate the book's main value. For each bullet point, add an appropriate emoji at the start of the sentence that captures the essence of that particular bullet point.
    Remove all text markup and return the output exactly using the following structure
    {
      "title": "Book title",
      "summary": "summary"
      "takeAways": ["key take away 1", "key take away 2"...]
    }
    `;
      // Send the prompt to the AI model and wait for the generated content
      const result = await this.genModel.generateContent(prompt);
      // Parse the AI response
      const content = await JSON.parse(result.response.text());

      // Create a summary object that includes the book's ID, title, summary, key takeaways, image, author, and category
      const summary =
        {
          id: book.id,
          ...content,
          image: book.image,
          author: book.author,
          category: book.category,
        } || {};

      // Store the generated summary in the local state
      this.state.summary = summary;
    } catch (error) {
      console.error("Error generating content:", error);
    }
  };

  getSummary = () => {
    return this.state.summary;
  };

  getBookmarks = () => {
    return JSON.parse(localStorage.getItem("bookmarks")) || [];
  };

  addBookmark = (bookmark) => {
    const bookmarks = this.getBookmarks();
    localStorage.setItem("bookmarks", JSON.stringify([...bookmarks, bookmark]));
  };

  findBookmark = (id) => {
    return this.getBookmarks().find((bookmark) => bookmark.id === id);
  };

  removeBookmark = (id) => {
    const updatedBookmarks = this.getBookmarks().filter((b) => b.id !== id);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  getDarkMode() {
    return localStorage.getItem("darkMode");
  }

  toggleDarkMode() {
    const isDarkMode = this.getDarkMode();
    localStorage.setItem(
      "darkMode",
      isDarkMode === "disabled" ? "enabled" : "disabled"
    );
  }
}
