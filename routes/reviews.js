const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/reviews');
const auth = require('../controllers/auth');
const {validateReview, validateReviewUpdate} = require('../controllers/validation');
const can = require('../permissions/reviews');

const router = Router({prefix: '/api/v1/reviews'});

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateReview, createReview);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateReviewUpdate, updateReview);
router.del('/:id([0-9]{1,})', auth, deleteReview);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'rating'; // order based on specified column

    let reviews = await model.getAll(limit, order);
    if (reviews.length) {
        ctx.body = reviews;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

async function getById(ctx) {
    let id = ctx.params.id;
    let review = await model.getById(id);
    if (review.length) {
        ctx.body = review[0];
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

async function createReview(ctx) {
    let body = ctx.request.body;
    let permission = can.create(ctx.state.user, body);

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
 
async function updateReview(ctx){
    let id = ctx.params.id;
    let result = await model.getById(id);

    if (result.length) {
        let data = result[0];
        let permission = can.update(ctx.state.user, data);

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

async function deleteReview(ctx){
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

module.exports = router;