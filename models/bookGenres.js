const db = require('../helpers/database');

// Get all genres that a specific book belongs to
exports.getAllGenres = async function getAll (id) {
    let query = "SELECT * FROM genres as g INNER JOIN bookGenres AS bg ON bg.genreID = g.ID WHERE bg.bookID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Get all books that belong to a specific genre
exports.getAllBooks = async function getAll (id) {
    let query = "SELECT * FROM books as b INNER JOIN bookGenres AS bg ON bg.bookID = b.ID WHERE bg.genreID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Add relation between book and genre.
exports.addGenre = async function addGenre (bookGenre) {
    let query = "INSERT INTO bookGenres SET ?";
    let values = [bookGenre];
    let data = await db.run_query(query, values);
    return data;
}

// Remove relation between book and genre.
exports.removeGenre = async function removeGenre (bookID, genreID) {
    let query = "DELETE FROM bookGenres WHERE bookID = ? and genreID = ?";
    let values = [bookID, genreID];
    let data = await db.run_query(query, values);
    return data;
}