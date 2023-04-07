const request = require('supertest')
const app = require('../app')

describe('Get a review by ID', () => {
  it('should get aa review by ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/reviews/1')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Update a review', () => {
  it('should update a review', async () => {
    const res = await request(app.callback())
      .put('/api/v1/reviews/2')
      .auth('pia', 'pereira')
      .send({
        rating: 8,
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Delete a review', () => {
  it('should delete a review', async () => {
    const res = await request(app.callback())
      .del('/api/v1/reviews/2')
      .auth('pia', 'pereira')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })
});