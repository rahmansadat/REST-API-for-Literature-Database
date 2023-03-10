const db = require('../helpers/database');

// Get a single user by their id
exports.getById = async function getById (id) {
    let query = "SELECT * FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

// Get all users
exports.getAll = async function getAll (limit, order) {
    let query = "SELECT * FROM users ORDER BY ?? LIMIT ?";
    let values = [order, limit];
    let data = await db.run_query(query, values);
    return data;
}

// Create a new user
exports.add = async function add (user) {
    const password = user.password
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);
    user.password = hash

    let query = "INSERT INTO users SET ?";
    let values = [user]
    let data = await db.run_query(query, values);
    return data;
}

// Update a user by their id
exports.updateById = async function updateById (user, id) {
    let query = "UPDATE users SET ? WHERE ID = ?";
    values = [user, id]
    let data = await db.run_query(query, values);
    return data;
}

// Delete a user by their id
exports.deleteById = async function deleteById (id) {
    let query = "DELETE FROM users WHERE ID = ?";
    let values = [id]
    let data = await db.run_query(query, values);
    return data;
}

// Get a single user by their username
exports.getByUsername = async function getByUsername (username) {
    let query = "SELECT * FROM users WHERE username = ?";
    let values = [username];
    let data = await db.run_query(query, values);
    return data;
}