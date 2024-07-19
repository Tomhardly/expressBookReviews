const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { reset } = require('nodemon');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop sync method:
//public_users.get('/',function (req, res) {
//    res.send(JSON.stringify(books, null, 4));
//});

// Get the book list promise:
public_users.get('/',async (req, res) => {
    try {
        const fetchBooks = () => new Promise((resolve) => {
            setTimeout(() => resolve(books), 100);
        });

        const booksList = await fetchBooks();
        res.send(JSON.stringify(booksList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const book = books[isbn];

        if (book) {
            res.send(JSON.stringify(book, null, 4));
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ message: "Error fetching book details" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
	    const author = req.params.author;
	    const booksByAuthor = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

	    if (booksByAuthor.length > 0) {
		    res.send(JSON.stringify(booksByAuthor, null, 4));
	    } else {
		    res.status(404).json({ message: "No books by that author" });
	    }
    } catch (error) {
	    console.error('Error fetching books by author:', error);
	    res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
	    const title = req.params.title;
	    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

	    if (booksByTitle.length > 0) {
		    res.send(JSON.stringify(booksByTitle, null, 4));
	    } else {
		    res.status(404).json({ message: "No books with that title" });
	    }
    } catch (error) {
	    console.error('Error fetching books by title:', error);
	    res.status(500).json({ message: "Error fetching books by title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        const reviews = book.reviews;
        if (Object.keys(reviews).length === 0) {
            res.status(200).json({ message: `No reviews for "${book.title}"` });    
        } else {
            res.send(JSON.stringify(reviews, null, 4));
        }
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
