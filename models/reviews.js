const db = require('../helpers/database');

// Get a single review by its id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM reviews WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Get all reviews
exports.getAll = async function getAll (bookID, order, limit) {
    let query = "SELECT * FROM reviews WHERE bookID = ? ORDER BY ?? LIMIT ?";
    let values = [bookID, order, limit];
    let data = await db.run_query(query, values);
    return data;
}

// Create a new review
exports.add = async function add (review) {
    let query = "INSERT INTO reviews SET ?";
    let values = [review]
    let data = await db.run_query(query, values);
    return data;
}

// Update a review by its id
exports.updateById = async function updateById (review, id) {
    let query = "UPDATE reviews SET ? WHERE ID = ?";
    values = [review, id]
    let data = await db.run_query(query, values);
    return data;
}

// Delete a review by its id
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM reviews WHERE ID = ?";
    let values = [id]
    let data = await db.run_query(query, values);
    return data;
}