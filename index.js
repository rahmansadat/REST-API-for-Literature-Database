const Koa = require('koa');

const books = require('./routes/books.js');
const genres = require('./routes/genres.js');
const authors = require('./routes/authors.js');

const app = new Koa();

app.use(books.routes());
app.use(genres.routes());
app.use(authors.routes());

let port = process.env.PORT || 3000;

app.listen(port);