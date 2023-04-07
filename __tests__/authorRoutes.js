const request = require('supertest')
const app = require('../app')

describe('Post new author', () => {
  it('should create a new author', async () => {
    const res = await request(app.callback())
      .post('/api/v1/authors')
      .auth('sadat', 'rahman')
      .send({
        fullName: 'example_author_name'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
  })
});

describe('Get all authors', () => {
  it('should get all authors', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Get an author by ID', () => {
  it('should get an author by ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors/1')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Update an author', () => {
  it('should update an author', async () => {
    const res = await request(app.callback())
      .put('/api/v1/authors/1')
      .auth('sadat', 'rahman')
      .send({
        fullName: 'updated_author_name'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Delete an author', () => {
  it('should delete an author', async () => {
    const res = await request(app.callback())
      .del('/api/v1/authors/4')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })
});

describe('Get books that belong to an author', () => {
  it('should get books that belong to an author', async () => {
    const res = await request(app.callback())
      .get('/api/v1/authors/2/books')
    expect(res.statusCode).toEqual(200)
  })
});