const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/authors');
const auth = require('../controllers/auth');
const {validateAuthor, validateAuthorUpdate} = require('../controllers/validation');
const can = require('../permissions/authors');

const prefix = '/api/v1/authors';
const router = Router({prefix: prefix});

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateAuthor, createAuthor);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateAuthorUpdate, updateAuthor);
router.del('/:id([0-9]{1,})', auth, deleteAuthor);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'fullName'; // order based on specified column

    let result = await model.getAll(limit, order);
    if (result.length) {
        const body = result.map(post => {
            const {ID, fullName, about, imageURL} = post;
            const links = {
                books: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/books`,
                self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
            }
            return {ID, fullName, about, imageURL, links};
        });

        ctx.body = body;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

async function getById(ctx) {
    let id = ctx.params.id;
    let result = await model.getById(id);
    if (result.length) {
        let body = result[0];
        const links = {
            books: `${ctx.protocol}://${ctx.host}${prefix}/${body.ID}/books`
        }
        body.links = links;

        ctx.body = body;
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
            let id = result.insertId;
            ctx.body = {ID: id, created: true, link: `${ctx.request.path}${id}`}
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
                ctx.body = {ID: id, updated: true, link: ctx.request.path};
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