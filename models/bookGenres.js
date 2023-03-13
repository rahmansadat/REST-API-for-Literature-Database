const db = require('../helpers/database');

// Get all genres that a specific book belongs to
exports.getAll = async function getAll (id) {
    let query = "SELECT * FROM genres as g INNER JOIN bookGenres AS bg ON bg.genreID = g.ID WHERE bg.bookID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}