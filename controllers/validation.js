const {Validator, ValidationError} = require('jsonschema');
const bookSchema = require('../schemas/book.json').definitions.book;
const bookUpdateSchema = require('../schemas/book.json').definitions.bookUpdate;
const genreSchema = require('../schemas/genre.json').definitions.genre;
const genreUpdateSchema = require('../schemas/genre.json').definitions.genreUpdate;
const reviewSchema = require('../schemas/review.json').definitions.review;
const reviewUpdateSchema = require('../schemas/review.json').definitions.reviewUpdate;
const authorSchema = require('../schemas/author.json').definitions.author;
const authorUpdateSchema = require('../schemas/author.json').definitions.authorUpdate;
const userSchema = require('../schemas/user.json').definitions.user;
const userUpdateSchema = require('../schemas/user.json').definitions.userUpdate;

const validatorFactory = (schema) => {
    const middlewareHandler = async (ctx, next) => {
        const body = ctx.request.body;
        
        try {
            v.validate(body, schema, validationOptions);
            await next();
        } catch (error) {
            if (error instanceof ValidationError) {
                ctx.body = error;
                ctx.status = 400;
            } else {
                throw error;
            }
        }
    }
    return middlewareHandler;
}


const v = new Validator();
const validationOptions = {
    throwError: true,
    allowUnknownAttributes: false
};

exports.validateBook = validatorFactory(bookSchema);
exports.validateBookUpdate = validatorFactory(bookUpdateSchema);
exports.validateGenre = validatorFactory(genreSchema);
exports.validateGenreUpdate = validatorFactory(genreUpdateSchema);
exports.validateReview = validatorFactory(reviewSchema);
exports.validateReviewUpdate = validatorFactory(reviewUpdateSchema);
exports.validateAuthor = validatorFactory(authorSchema);
exports.validateAuthorUpdate = validatorFactory(authorUpdateSchema);
exports.validateUser = validatorFactory(userSchema);
exports.validateUserUpdate = validatorFactory(userUpdateSchema);