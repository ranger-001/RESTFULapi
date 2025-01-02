const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 4000;

// Middleware
app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // Replace with your MySQL username
  password: '',         // Replace with your MySQL password
  database: 'library_management'   // Replace with your MySQL database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Updated validation function to allow numeric strings for year
function isValidBookData(title, author, genre, year) {
  return (
    typeof title === 'string' &&
    title.trim() !== '' &&
    typeof author === 'string' &&
    author.trim() !== '' &&
    typeof genre === 'string' &&
    genre.trim() !== '' &&
    !isNaN(Number(year)) // Convert to number and check if it's valid
  );
}

// CREATE: Add a new book
app.post('/api/books', (req, res) => {
  // Log the incoming request body for debugging
  console.log('Request Body:', req.body);

  const { title, author, genre, year } = req.body;

  if (!isValidBookData(title, author, genre, year)) {
    return res.status(400).json({ error: 'Invalid input. Ensure all fields are correctly filled.' });
  }

  const query = 'INSERT INTO books (title, author, genre, year) VALUES (?, ?, ?, ?)';
  db.query(query, [title, author, genre, year], (err, result) => {
    if (err) {
      console.error('Error inserting book:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Book added successfully', bookId: result.insertId });
  });
});
v
// READ: Get all books
app.get('/api/books', (req, res) => {
  const query = 'SELECT * FROM books';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// READ: Get a book by ID
app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error fetching book:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(result[0]);
  });
});

// UPDATE: Update a book by ID
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, genre, year } = req.body;

  if (!isValidBookData(title, author, genre, year)) {
    return res.status(400).json({ error: 'Invalid input. Ensure all fields are correctly filled.' });
  }

  const query = 'UPDATE books SET title = ?, author = ?, genre = ?, year = ? WHERE id = ?';
  db.query(query, [title, author, genre, year, id], (err, result) => {
    if (err) {
      console.error('Error updating book:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Book updated successfully' });
  });
});

// DELETE: Delete a book by ID
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting book:', err);
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
