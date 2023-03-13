const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const model = require('../models/genres');
const bookGenresModel = require('../models/bookGenres');

const auth = require('../controllers/auth');
const {validateGenre, validateGenreUpdate} = require('../controllers/validation');
const can = require('../permissions/genres');

const bookPrefix = '/api/v1/books';
const prefix = '/api/v1/genres';
const router = Router({prefix: prefix});

router.get('/', getAll);
router.post('/', auth, bodyParser(), validateGenre, createGenre);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', auth, bodyParser(), validateGenreUpdate, updateGenre);
router.del('/:id([0-9]{1,})', auth, deleteGenre);

router.get('/:id([0-9]{1,})/books', getBooks);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'name'; // order based on specified column

    let result = await model.getAll(limit, order);
    if (result.length) {

        const body = result.map(post => {
            const {ID, name, description, imageURL} = post;
            const links = {
                books: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}/books`,
                self: `${ctx.protocol}://${ctx.host}${prefix}/${post.ID}`
            }
            return {ID, name, description, imageURL, links};
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

async function createGenre(ctx) {
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

async function updateGenre(ctx){
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

async function deleteGenre(ctx){
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

async function getBooks(ctx) {
    let id = ctx.params.id;

    let result = await model.getById(id);
    if (result.length) {
        let genresResult = await bookGenresModel.getAllBooks(id);
        console.log(genresResult)
        if (genresResult.length) {
            const body = genresResult.map(post => {
                const {ID, title, summary, datePublished, isbn, imageURL, authorID} = post;
                const links = {
                    reviews: `${ctx.protocol}://${ctx.host}${bookPrefix}/${post.ID}/reviews`,
                    genres: `${ctx.protocol}://${ctx.host}${bookPrefix}/${post.ID}/genres`,
                    author: `${ctx.protocol}://${ctx.host}${bookPrefix}/${post.ID}/author`,
                    self: `${ctx.protocol}://${ctx.host}${bookPrefix}/${post.ID}`,
                }
                return {ID, title, summary, datePublished, isbn, imageURL, authorID, links};
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