const db = require('../helpers/database');

// Get a single author by their id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM authors WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Get all authors
exports.getAll = async function getAll (limit, order) {
    let query = "SELECT * FROM authors ORDER BY ?? LIMIT ?";
    let values = [order, limit];
    let data = await db.run_query(query, values);
    return data;
}

// Create a new author
exports.add = async function add (author) {
    let query = "INSERT INTO authors SET ?";
    let values = [author]
    let data = await db.run_query(query, values);
    return data;
}

// Update an author by their id
exports.updateById = async function updateById (author, id) {
    let query = "UPDATE authors SET ? WHERE ID = ?";
    values = [author, id]
    let data = await db.run_query(query, values);
    return data;
}

// Delete an author by their id
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM authors WHERE ID = ?";
    let values = [id]
    let data = await db.run_query(query, values);
    return data;
}