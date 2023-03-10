const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/books');

const router = Router({prefix: '/api/v1/books'});

router.get('/', getAll);

async function getAll(ctx) {
    const limit = 10; // number of records to return
    const order = 'title'; // order based on specified column

    let books = await model.getAll(limit, order);
    if (books.length) {
        ctx.body = books;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

module.exports = router;