const db = require('../helpers/database');

// Get a single book by its id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM books WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Get all books
exports.getAll = async function getAll (limit, order) {
    let query = "SELECT * FROM books ORDER BY ?? LIMIT ?";
    let values = [order,  limit];
    let data = await db.run_query(query, values);
    return data;
}

// Create a new book
exports.add = async function add (book) {
    let query = "INSERT INTO books SET ?";
    let values = [book]
    let data = await db.run_query(query, values);
    return data;
}

// Update a book by its id
exports.updateById = async function updateById (book, id) {
    let query = "UPDATE books SET ? WHERE ID = ?";
    let values = [book, id]
    let data = await db.run_query(query, values);
    return data;
}

// Delete a book by its id
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM books WHERE ID = ?";
    let values = [id]
    let data = await db.run_query(query, values);
    return data;
}

// Get all books by author
exports.getAllByAuthor = async function getAll (authorID) {
    let query = "SELECT * FROM books WHERE authorID = ?";
    let values = [authorID];
    let data = await db.run_query(query, values);
    return data;
}
