const request = require('supertest')
const app = require('../app')

describe('Post a new user', () => {
  it('should create a new user', async () => {
    const res = await request(app.callback())
      .post('/api/v1/users')
      .send({
        username: 'example_user',
        password: 'example_password',
        email: 'example_email@example.com'
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
  })
});

describe('Get all users', () => {
  it('should get all users', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Get an user by ID', () => {
  it('should get an user by ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/1')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Update an user', () => {
  it('should update an user', async () => {
    const res = await request(app.callback())
      .put('/api/v1/users/1')
      .auth('sadat', 'rahman')
      .send({
        email: 'updated_email@example.com'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Delete an user', () => {
  it('should delete an user', async () => {
    const res = await request(app.callback())
      .del('/api/v1/users/4')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })
});

describe('Get reviews of an user', () => {
  it('should get reviews of an user', async () => {
    const res = await request(app.callback())
      .get('/api/v1/users/3/reviews')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
  })
});