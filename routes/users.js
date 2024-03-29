const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const model = require('../models/users');
const reviewModel = require('../models/reviews');

const auth = require('../controllers/auth');
const {validateUser, validateUserUpdate} = require('../controllers/validation');
const can = require('../permissions/users');

const reviewPrefix = '/api/v1/reviews';
const bookPrefix = '/api/v1/books';
const prefix = '/api/v1/users';
const router = Router({prefix: prefix});

router.get('/', auth, getAll);
router.post('/', bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', auth, getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateUserUpdate, updateUser);
router.del('/:id([0-9]{1,})', auth, deleteUser);

router.get('/:id([0-9]{1,})/reviews', getReviews);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'username'; // order based on specified column

    let result = await model.getAll(limit, order);
    if (result.length) {
        let data = result;
        let permission = can.readAll(ctx.state.user, data);
        if (!permission.granted) {
            ctx.status = 403;
        } else {
            const body = data.map(post => {
                const {ID, role, firstName, lastName, username, about, dateRegistered, email, avatarURL} = post;
                const links = {
                    reviews: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/reviews`,
                    self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
                }
                return {ID, role, firstName, lastName, username, about, dateRegistered, email, avatarURL, links};
            });

            ctx.body = body;
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

            const links = {
                reviews: `${ctx.protocol}://${ctx.host}${prefix}/${id}/reviews`,
            }
            body.links = links

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
        let id = result.insertId;
        ctx.body = {ID: id, created: true, link: `${ctx.request.path}/${id}`}
        ctx.status = 201;
    } else {
        ctx.status = 400;
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
                ctx.status = 400;
            }
        }    
    } else {
        ctx.status = 404;
    }
}

async function getReviews(ctx) {
    let limit = 10; // number of records to return
    let order = 'rating'; // order based on specified column
    let id = ctx.params.id;

    let result = await reviewModel.getAllByUser(id, order, limit);
    if (result.length) {
        const body = result.map(post => {
            const {ID, rating, allText, dateCreated, dateModified, userID, bookID} = post;
            const links = {
                book: `${ctx.protocol}://${ctx.host}${bookPrefix}/${post.bookID}`,
                user: `${ctx.protocol}://${ctx.host}${prefix}/${id}`,
                self: `${ctx.protocol}://${ctx.host}${reviewPrefix}/${post.ID}`
            }
            return {ID, rating, allText, dateCreated, dateModified, userID, bookID, links};
        });
        ctx.body = body;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

module.exports = router;