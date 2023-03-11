const {Validator, ValidationError} = require('jsonschema');
const bookSchema = require('../schemas/book.json').definitions.book;
const bookUpdateSchema = require('../schemas/book.json').definitions.bookUpdate;

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