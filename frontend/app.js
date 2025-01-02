const apiUrl = 'http://localhost:4000/api/books'; // URL of the backend API

const bookList = document.getElementById('book-list');
const addBookForm = document.getElementById('add-book-form');

// Variable to keep track of the current book being edited (if any)
let editingBookId = null;

// Fetch books and update the list
const fetchBooks = async () => {
  try {
    const response = await fetch(apiUrl);
    const books = await response.json();
    const bookListBody = bookList.querySelector('tbody');

    // Clear the existing table rows
    bookListBody.innerHTML = '';

    // Display the books in the table
    books.forEach(book => {
      const row = bookListBody.insertRow(); // Insert a new row
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td>
          <button onclick="editBook(${book.id}, '${book.title}', '${book.author}', '${book.genre}', ${book.year})">Edit</button>
          <button onclick="deleteBook(${book.id})">Delete</button>
        </td>
      `;
    });
  } catch (error) {
    console.error('Error fetching books:', error);
  }
};

// Add or update a book
const addNewBook = async (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const genre = document.getElementById('genre').value;
  const year = document.getElementById('year').value;

  const newBook = { title, author, genre, year: parseInt(year, 10) };

  try {
    let response;
    if (editingBookId) {
      // Update book
      response = await fetch(`${apiUrl}/${editingBookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
    } else {
      // Add new book
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
    }

    if (response.ok) {
      fetchBooks(); // Refresh the book list
      addBookForm.reset(); // Clear the form
      editingBookId = null; // Reset editing mode
    } else {
      console.error('Failed to add or update the book');
    }
  } catch (error) {
    console.error('Error adding/updating book:', error);
  }
};

// Edit book details
const editBook = (id, title, author, genre, year) => {
  editingBookId = id; // Set the ID of the book being edited
  document.getElementById('title').value = title;
  document.getElementById('author').value = author;
  document.getElementById('genre').value = genre;
  document.getElementById('year').value = year;
};

// Delete book
const deleteBook = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchBooks(); // Refresh the book list
    } else {
      console.error('Failed to delete the book');
    }
  } catch (error) {
    console.error('Error deleting book:', error);
  }
};

// Initialize the page by fetching books
window.onload = () => {
  fetchBooks(); // Fetch and display all books on page load
  addBookForm.addEventListener('submit', addNewBook);
};
