const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const model = require('../models/books');
const authorModel = require('../models/authors');
const reviewModel = require('../models/reviews');
const bookGenresModel = require('../models/bookGenres');

const auth = require('../controllers/auth');
const {validateBook, validateBookUpdate} = require('../controllers/validation');
const can = require('../permissions/books');

const genrePrefix = '/api/v1/genres';
const reviewPrefix = '/api/v1/reviews';
const authorPrefix = '/api/v1/authors';
const prefix = '/api/v1/books';
const router = Router({prefix: prefix});

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateBook, createBook);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateBookUpdate, updateBook);
router.del('/:id([0-9]{1,})', auth, deleteBook);

router.get('/:id([0-9]{1,})/author', getAuthor);

router.get('/:id([0-9]{1,})/reviews', getReviews);
// router.post('/:id([0-9]{1,})/reviews', auth, bodyParser(), addReviewIDs, validateReview, addReview);

router.get('/:id([0-9]{1,})/genres', getGenres);
// router.post('/:id([0-9]{1,})/genres/:gid([0-9]{1,})', auth, addGenre); // maybe bodyparser?
// router.del('/:id([0-9]{1,})/genres/:gid([0-9]{1,})', auth, removeGenre);


async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'title'; // order based on specified column

    let result = await model.getAll(limit, order);
    if (result.length) {
        const body = result.map(post => {
            const {ID, title, summary, datePublished, isbn, imageURL, authorID} = post;
            const links = {
                reviews: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/reviews`,
                genres: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/genres`,
                author: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/author`,
                self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
            }
            return {ID, title, summary, datePublished, isbn, imageURL, authorID, links};
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
            reviews: `${ctx.protocol}://${ctx.host}${prefix}/${body.ID}/reviews`,
            genres: `${ctx.protocol}://${ctx.host}${prefix}/${body.ID}/genres`,
            author: `${ctx.protocol}://${ctx.host}${prefix}/${body.ID}/author`,
        }
        body.links = links;

        ctx.body = body;
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
            let id = result.insertId
            ctx.body = {ID: id, created: true, link: `${ctx.request.path}${id}`}
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

async function getAuthor(ctx) {
    let id = ctx.params.id;
    let result = await model.getById(id);
    if (result.length) {
        let authorID = result[0].authorID;
        let authorResult = await authorModel.getById(authorID);

        if (authorResult.length) {
            let body = authorResult[0];

            const links = {
                books: `${ctx.protocol}://${ctx.host}${authorPrefix}/${authorID}/books`
            }
            body.links = links;

            ctx.body = body;
            ctx.status = 200;

        } else {
            ctx.status = 404;
        }
    } else {
        ctx.status = 404;
    }
}

async function getReviews(ctx) {
    let limit = 10; // number of records to return
    let order = 'rating'; // order based on specified column
    let id = ctx.params.id;

    let result = await reviewModel.getAll(id, order, limit);
    if (result.length) {

        const body = result.map(post => {
            const {ID, rating, allText, dateCreated, dateModified, userID, bookID} = post;
            const links = {
                book: `${ctx.protocol}://${ctx.host}${prefix}/${id}`,
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


async function getGenres(ctx) {
    let id = ctx.params.id;

    let result = await model.getById(id);
    if (result.length) {
        let genresResult = await bookGenresModel.getAllGenres(id);
        if (genresResult.length) {
            const body = genresResult.map(post => {
                const {ID, name, description, imageURL, genreID, bookID} = post;
                const links = {
                    book: `${ctx.protocol}://${ctx.host}${prefix}/${id}`,
                    self: `${ctx.protocol}://${ctx.host}${genrePrefix}/${post.ID}`,
                }
                return {ID, name, description, imageURL, genreID, bookID, links};
            });

            ctx.body = body;
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    } else {
        ctx.status = 404;
    }
}

module.exports = router;