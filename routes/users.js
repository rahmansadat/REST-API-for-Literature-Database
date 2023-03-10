const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');

const router = Router({prefix: '/api/v1/users'});

router.get('/', auth, getAll);
router.post('/', bodyParser(), createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'username'; // order based on specified column

    let users = await model.getAll(limit, order);
    if (users.length) {
        ctx.body = users;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

  async function getById(ctx) {
    let id = ctx.params.id;
    let user = await model.getById(id);
    if (user.length) {
        ctx.body = user[0];
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

  async function createUser(ctx) {
    let body = ctx.request.body;
    let result = await model.add(body);
    if (result.affectedRows) {
        ctx.body = {ID: result.insertId, created: true}
        ctx.status = 201;
    } else {
        ctx.status = 404;
    }
}

  async function updateUser(ctx){
    let id = ctx.params.id;
    let body = ctx.request.body;
    let result = await model.updateById(body, id);
    if (result.affectedRows) {
        ctx.body = {ID: id, updated: true};
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

  async function deleteUser(ctx){
    let id = ctx.params.id;
    let result = await model.deleteById(id);
    if (result.affectedRows) {
        ctx.body = {ID: id, deleted: true};
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

module.exports = router;