const request = require('supertest')
const app = require('../app')

describe('Post new genre', () => {
  it('should create a new genre', async () => {
    const res = await request(app.callback())
      .post('/api/v1/genres')
      .auth('sadat', 'rahman')
      .send({
        name: 'example_genre'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
  })
});

describe('Get all genres', () => {
  it('should get all genres', async () => {
    const res = await request(app.callback())
      .get('/api/v1/genres')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Get a genre by ID', () => {
  it('should get a genre by ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/genres/1')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Update a genre', () => {
  it('should update a genre', async () => {
    const res = await request(app.callback())
      .put('/api/v1/genres/1')
      .auth('sadat', 'rahman')
      .send({
        name: 'update_genre'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Delete a genre', () => {
  it('should delete a genre', async () => {
    const res = await request(app.callback())
      .del('/api/v1/genres/8')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })
});

describe('Get books that belong to a genre', () => {
  it('should get books that belong to a genre', async () => {
    const res = await request(app.callback())
      .get('/api/v1/genres/3/books')
    expect(res.statusCode).toEqual(200)
  })
});