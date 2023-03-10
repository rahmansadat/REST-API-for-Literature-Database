const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const model = require('../models/genres');

const router = Router({prefix: '/api/v1/genres'});

router.get('/', getAll);
router.post('/', bodyParser(), createGenre);
router.get('/:id([0-9]{1,})', getById);
router.put('/:id([0-9]{1,})', bodyParser(), updateGenre);
router.del('/:id([0-9]{1,})', deleteGenre);

async function getAll(ctx) {
    let limit = 10; // number of records to return
    let order = 'name'; // order based on specified column

    let genres = await model.getAll(limit, order);
    if (genres.length) {
        ctx.body = genres;
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}

  async function getById(ctx) {
    let id = ctx.params.id;
    let genre = await model.getById(id);
    if (genre.length) {
        ctx.body = genre[0];
        ctx.status = 200;
    } else {
        ctx.status = 404;
    }
}
  
  async function createGenre(ctx) {
    let body = ctx.request.body;
    let result = await model.add(body);
    if (result.affectedRows) {
        ctx.body = {ID: result.insertId, created: true}
        ctx.status = 201;
    } else {
        ctx.status = 404;
    }
}
  
  async function updateGenre(ctx){
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
  
  async function deleteGenre(ctx){
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