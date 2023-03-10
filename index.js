const Koa = require('koa');

const books = require('./routes/books.js');

const app = new Koa();

app.use(books.routes());

let port = process.env.PORT || 3000;

app.listen(port);