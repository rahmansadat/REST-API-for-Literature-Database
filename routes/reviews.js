const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/reviews');
const auth = require('../controllers/auth');
const {validateReview, validateReviewUpdate} = require('../controllers/validation');
const can = require('../permissions/reviews');

const userPrefix = '/api/v1/users';
const bookPrefix = '/api/v1/books';
const prefix = '/api/v1/reviews';
const router = Router({prefix: prefix});

router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateReviewUpdate, updateReview);
router.del('/:id([0-9]{1,})', auth, deleteReview);

async function getById(ctx) {
    let id = ctx.params.id;
    let review = await model.getById(id);
    if (review.length) {
        let body = review[0];

        const links = {
            book: `${ctx.protocol}://${ctx.host}${bookPrefix}/${body.bookID}`,
            user: `${ctx.protocol}://${ctx.host}${userPrefix}/${body.userID}`
        }
        body.links = links;

        ctx.body = body
        ctx.status = 200;
    } else {
        ctx.status = 404;
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