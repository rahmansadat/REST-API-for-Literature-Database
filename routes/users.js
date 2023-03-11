const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/users');
const auth = require('../controllers/auth');
const {validateUser, validateUserUpdate} = require('../controllers/validation');
const can = require('../permissions/users');

const router = Router({prefix: '/api/v1/users'});

router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'username'; // order based on specified column

    let result = await model.getAll(limit, order);
    if (result.length) {
        let data = result;
        let permission = can.update(ctx.state.user, data);
        if (!permission.granted) {
            ctx.status = 403;
        } else {
            ctx.body = result;
            ctx.status = 200;
        }
    } else {
        ctx.status = 404;
    }
}

async function getById(ctx) {
    let id = ctx.params.id;
    let result = await model.getById(id);
  
    if (result.length) {
        let data = result[0];
        let permission = can.read(ctx.state.user, data);
      
        if (!permission.granted) {
            ctx.status = 403;
        } else {
            let body = permission.filter(data);
            ctx.body = body;
            ctx.status = 200;
        }
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

async function updateUser(ctx) {
    let id = ctx.params.id;
    let result = await model.getById(id);
  
    if (result.length) {
        let data = result[0];
        let permission = can.update(ctx.state.user, data);

        if (!permission.granted) {
            ctx.status = 403;
        } else {
            let newData = permission.filter(ctx.request.body);
            result = await model.updateById(newData, id);
            if (result.affectedRows) {
                ctx.body = {ID: id, updated: true};
                ctx.status = 200;
            } else {
                ctx.status = 404;
            }
        }
    } else {
        ctx.status = 404;
    }
}

async function deleteUser(ctx){
    let id = ctx.params.id;
    let result = await model.getById(id);
  
    if (result.length) {
        let data = result[0];
        let permission = can.delete(ctx.state.user, data);
  
        if (!permission.granted) {
            ctx.status = 403;
        } else {
            let result = await model.deleteById(id);
            if (result.affectedRows) {
                ctx.body = {ID: id, deleted: true};
                ctx.status = 200;
            } else {
                ctx.status = 404;
            }
        }    
    } else {
        ctx.status = 404;
    }
}

module.exports = router;