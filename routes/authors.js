const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/authors');
const auth = require('../controllers/auth');
const {validateAuthor, validateAuthorUpdate} = require('../controllers/validation');
const can = require('../permissions/authors');

const router = Router({prefix: '/api/v1/authors'});

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateAuthor, createAuthor);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateAuthorUpdate, updateAuthor);
router.del('/:id([0-9]{1,})', auth, deleteAuthor);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'fullName'; // order based on specified column

    let authors = await model.getAll(limit, order);
    if (authors.length) {
        ctx.body = authors;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

async function getById(ctx) {
    let id = ctx.params.id;
    let author = await model.getById(id);
    if (author.length) {
        ctx.body = author[0];
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}
  
async function createAuthor(ctx) {
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

async function updateAuthor(ctx){
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

async function deleteAuthor(ctx){
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