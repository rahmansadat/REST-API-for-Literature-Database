const axios = require('axios');

exports.getBookData = async function getBookData(bookTitle) {

    let url, result

    let formattedBookTitle = bookTitle.replace(" ", "+");
    url = `https://openlibrary.org/search.json?q=${formattedBookTitle}`

    const config = {
        method: 'get',
        url: url
    }

    result = await axios(config)

    if (result.status == 200) {
        return result.data
    } else {
        console.log("No book data was found via OpenLibrary API.")
        return undefined;
    }
}