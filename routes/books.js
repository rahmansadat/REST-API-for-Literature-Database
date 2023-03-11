const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/books');
const auth = require('../controllers/auth');
const {validateBook, validateBookUpdate} = require('../controllers/validation');
const can = require('../permissions/books');

const router = Router({prefix: '/api/v1/books'});

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateBook, createBook);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateBookUpdate, updateBook);
router.del('/:id([0-9]{1,})', auth, deleteBook);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'title'; // order based on specified column

    let books = await model.getAll(limit, order);
    if (books.length) {
        ctx.body = books;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

async function getById(ctx) {
    let id = ctx.params.id;
    let book = await model.getById(id);
    if (book.length) {
        ctx.body = book[0];
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

async function createBook(ctx) {
    let body = ctx.request.body;
    let permission = can.create(ctx.state.user);

    if (!permission.granted) {
        ctx.status = 403;
    } else {
        let result = await model.add(body);
        if (result.affectedRows) {
            ctx.body = {ID: result.insertId, created: true}
            ctx.status = 201;
        } else {
            ctx.status = 400;
        }
    }
}

async function updateBook(ctx){
    let id = ctx.params.id;
    let result = await model.getById(id);

    if (result.length) {
        let permission = can.update(ctx.state.user);

        if (!permission.granted) {
            ctx.status = 403;
        } else {
            let data = ctx.request.body;
            let result = await model.updateById(data, id);
            if (result.affectedRows) {
                ctx.body = {ID: id, updated: true};
                ctx.status = 200;
            } else {
                ctx.status = 400;
            }
        }
    } else {
        ctx.status = 404;
    }
}

async function deleteBook(ctx){
    let id = ctx.params.id;
    let result = await model.getById(id);

    if (result.length) {
        let permission = can.delete(ctx.state.user);

        if (!permission.granted) {
            ctx.status = 403;
        } else {

            let result = await model.deleteById(id);
            if (result.affectedRows) {
                ctx.body = {ID: id, deleted: true};
                ctx.status = 200;
            } else {
                ctx.status = 400;
            }
        }       
    } else {
        ctx.status = 404;
    }
}

module.exports = router;