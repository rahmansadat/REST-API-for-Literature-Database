const Koa = require('koa');

const books = require('./routes/books.js');
const genres = require('./routes/genres.js');
const authors = require('./routes/authors.js');
const reviews = require('./routes/reviews.js');
const users = require('./routes/users.js');

const app = new Koa();

app.use(books.routes());
app.use(genres.routes());
app.use(authors.routes());
app.use(reviews.routes());
app.use(users.routes());

let port = process.env.PORT || 3000;

app.listen(port);