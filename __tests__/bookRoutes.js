const request = require('supertest')
const app = require('../app')

describe('Post a new book', () => {
  it('should create a new book', async () => {
    const res = await request(app.callback())
      .post('/api/v1/books')
      .auth('sadat', 'rahman')
      .send({
        title: 'Murder on the Orient Express',
        authorID: 1
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('created', true)
  })
});

describe('Get all books', () => {
  it('should get all books', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Get a book by ID', () => {
  it('should get an user by ID', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Update a book', () => {
  it('should update a book', async () => {
    const res = await request(app.callback())
      .put('/api/v1/books/1')
      .auth('sadat', 'rahman')
      .send({
        summary: 'example_summary_of_book'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('updated', true)
  })
});

describe('Delete a book', () => {
  it('should delete a book', async () => {
    const res = await request(app.callback())
      .del('/api/v1/books/5')
      .auth('sadat', 'rahman')
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('deleted', true)
  })
});

describe('Get the author of a book', () => {
  it('should get the author of a book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1/author')
    expect(res.statusCode).toEqual(200)
  })
});

describe('Get the reviews of a book', () => {
  it('should get the reviews of a book', async () => {
    const res = await request(app.callback())
      .get('/api/v1/books/1/reviews')
    expect(res.statusCode).toEqual(200)
    })
});

describe('Post a review on a book', () => {
    it('should post a review on a book', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books/1/reviews')
        .auth('pia', 'pereira')
        .send({
          allText: 'example_review_contents',
          rating: 1
        })
      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('created', true)
      })
  });

  describe('Get the genres of a book', () => {
    it('should get the genres of a book', async () => {
      const res = await request(app.callback())
        .get('/api/v1/books/1/genres')
      expect(res.statusCode).toEqual(200)
    })
  });

  describe('Add a genre to a book', () => {
    it('should add a genre to a book', async () => {
      const res = await request(app.callback())
        .post('/api/v1/books/1/genres/7')
        .auth('sadat', 'rahman')
      expect(res.statusCode).toEqual(201)
    })
  });

  describe('Remove a genre from a book', () => {
    it('should remove a genre from a book', async () => {
      const res = await request(app.callback())
        .del('/api/v1/books/1/genres/7')
        .auth('sadat', 'rahman')
      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('deleted', true)
    })
  });

  describe('Get the first sentence of a book', () => {
    it('should get the first sentence of a book', async () => {
      const res = await request(app.callback())
        .get('/api/v1/books/3/firstSentence')
      expect(res.statusCode).toEqual(200)
    })
  });

  describe('Get the page count of a book', () => {
    it('should get the page count of a book', async () => {
      const res = await request(app.callback())
        .get('/api/v1/books/3/pageCount')
      expect(res.statusCode).toEqual(200)
    })
  });