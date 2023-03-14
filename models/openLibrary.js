const db = require('../helpers/database');

// Get data received from OpenLibrary
exports.get = async function get (id) {
    let query = "SELECT * FROM openLibrary WHERE bookID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}


// Store data received from OpenLibrary
exports.add = async function add (openLibraryData) {
    let query = "INSERT INTO openLibrary SET ?";
    let values = [openLibraryData]
    let data = await db.run_query(query, values);
    return data;
}
