const db = require('../helpers/database');

// Get a single genre by its id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM genres WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Get all genres
exports.getAll = async function getAll (limit, order) {
    let query = "SELECT * FROM genres ORDER BY ?? LIMIT ?";
    let values = [order, limit];
    let data = await db.run_query(query, values);
    return data;
}

// Create a new genre
exports.add = async function add (genre) {
    let query = "INSERT INTO genres SET ?";
    let values = [genre]
    let data = await db.run_query(query, values);
    return data;
}

// Update a genre by its id
exports.updateById = async function updateById (genre, id) {
    let query = "UPDATE genres SET ? WHERE ID = ?";
    values = [genre, id]
    let data = await db.run_query(query, values);
    return data;
}

// Delete a genre by its id
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM genres WHERE ID = ?";
    let values = [id]
    let data = await db.run_query(query, values);
    return data;
}